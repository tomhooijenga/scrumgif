import {Button} from "./Button.tsx";

interface RoomControlsProps {
  onReset: () => void;
  onReveal: () => void;
}

export function RoomControls({ onReset, onReveal }: RoomControlsProps) {
  return (
    <div className={'flex flex-col items-center justify-evenly gap-3'}>
      <Button onClick={onReset} variant="secondary">Reset</Button>
      <Button onClick={onReveal} variant="primary">Reveal cards</Button>
    </div>
  );
}


