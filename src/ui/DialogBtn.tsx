import { Box, Button, CloseButton, Dialog, Portal } from "@chakra-ui/react";
import { useState, type ReactNode } from "react";
import { LuLoader } from "react-icons/lu";

type DialogBtnProps = {
  title: string;
  text: string;
  colorPalette: string;
  yes: string;
  no: string;
  button: ReactNode;
  onClick: () => void;
}

const DialogBtn = ({ title, text, yes, no, button, colorPalette, onClick }: DialogBtnProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const handleYes = async () => {
                setIsLoading(true)
                await onClick();
                setIsOpen(false);
                setIsLoading(false)
              }
 
    return (
    <Dialog.Root open={isOpen} onOpenChange={() => setIsOpen(prev => !prev)}>
      <Dialog.Trigger asChild>{button}</Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>{title}</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <p>{text}</p>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">{no}</Button>
              </Dialog.ActionTrigger>
              <Button colorPalette={colorPalette} onClick={handleYes}>{isLoading ? <Box animation={"spin"}><LuLoader /></Box> : yes }</Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}


export default DialogBtn