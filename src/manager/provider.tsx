import {
  ComponentProps,
  FC,
  PropsWithChildren,
  Suspense,
  createContext,
  useCallback,
  useRef,
  useState,
} from "react";
import { Modal, dialogManager } from "./dialog-manager";

type Dialog = {
  id: string;
  component: () => JSX.Element;
};

export type CloseHandler = { onCloseHandler?: VoidFunction };

class Defer<T> {
  public promise: Promise<T>;
  public resolve!: (value: T | PromiseLike<T>) => void;
  public reject!: (reason?: any) => void;

  constructor() {
    this.promise = new Promise<T>((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
}

const useDialogProvider = () => {
  const promisesDialog = useRef<Record<string, Defer<any>>>({});
  const [activeDialogs, setActiveDialogs] = useState<Array<Dialog>>([]);

  const close = useCallback(
    (dialogId: string, value?: unknown) => {
      promisesDialog.current[dialogId].resolve(value);
      setActiveDialogs(
        activeDialogs.filter((dialog) => dialog.id !== dialogId)
      );
    },
    [activeDialogs, setActiveDialogs]
  );

  const open = useCallback(
    <T extends Modal, TValue = undefined>(
      type: Modal,
      props: Omit<ComponentProps<(typeof dialogManager)[T]>, "onCloseHandler">
    ): Promise<TValue> => {
      const id = Math.random().toString();
      promisesDialog.current[id] = new Defer<TValue>();
      const Component = dialogManager[type as Modal];

      setActiveDialogs([
        {
          id,
          component: () => (
            // @ts-expect-error
            <Component
              {...props}
              onCloseHandler={(value: TValue) => close(id, value)}
            />
          ),
        },
        ...activeDialogs,
      ]);

      return promisesDialog.current[id].promise;
    },
    []
  );

  return { open, activeDialogs };
};

export const DialogContext = createContext<
  ReturnType<typeof useDialogProvider> | undefined
>(undefined);

export const DialogProvider: FC<PropsWithChildren> = ({ children }) => {
  const value = useDialogProvider();

  return (
    <DialogContext.Provider value={value}>
      {children}
      {value.activeDialogs.length ? (
        <Suspense fallback={null}>
          {value.activeDialogs.map(({ id, component: LazyDialog }) => (
            <LazyDialog key={id} />
          ))}
        </Suspense>
      ) : null}
    </DialogContext.Provider>
  );
};
