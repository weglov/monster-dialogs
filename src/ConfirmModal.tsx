import { AlertDialog, Button, Flex } from "@radix-ui/themes";

type Props = {
  text: string;
  onCloseHandler: (confirmed: boolean) => void;
};

export default function ConfirmModal({ text, onCloseHandler }: Props) {
  return (
    <AlertDialog.Root open onOpenChange={() => onCloseHandler?.(false)}>
      <AlertDialog.Content style={{ maxWidth: 450 }}>
        <AlertDialog.Title>{text}</AlertDialog.Title>
        <AlertDialog.Description size="2">
          Are you sure? This application will no longer be accessible and any
          existing sessions will be expired.
        </AlertDialog.Description>

        <Flex gap="3" mt="4" justify="end">
          <AlertDialog.Cancel>
            <Button
              variant="soft"
              onClick={() => onCloseHandler?.(false)}
              color="gray"
            >
              Cancel
            </Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action>
            <Button
              variant="solid"
              onClick={() => onCloseHandler?.(true)}
              color="red"
            >
              Revoke access
            </Button>
          </AlertDialog.Action>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
}
