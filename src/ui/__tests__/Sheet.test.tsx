import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { Sheet } from '../Sheet/Sheet';

function Harness({ onClose }: { onClose?: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Open
      </button>
      <Sheet
        open={open}
        title="Hallow's End"
        onClose={() => {
          onClose?.();
          setOpen(false);
        }}
      >
        <a href="#guide">Guide</a>
        <button type="button">Add to calendar</button>
      </Sheet>
    </>
  );
}

async function openSheet() {
  const user = userEvent.setup();
  render(<Harness />);
  const opener = screen.getByRole('button', { name: 'Open' });
  await user.click(opener);
  return { user, opener, dialog: screen.getByRole('dialog', { name: "Hallow's End" }) };
}

describe('Sheet', () => {
  it('opens as a labelled modal dialog, focuses it and locks page scroll', async () => {
    const { dialog } = await openSheet();
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveFocus();
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('closes on Escape and restores focus and scroll', async () => {
    const { user, opener } = await openSheet();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(opener).toHaveFocus();
    expect(document.body.style.overflow).toBe('');
  });

  it('closes from the close button and the backdrop', async () => {
    const { user } = await openSheet();
    await user.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Open' }));
    const backdrop = document.querySelector('[aria-hidden="true"]:not(svg)');
    await user.click(backdrop as HTMLElement);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('traps Tab focus inside the panel', async () => {
    const { user } = await openSheet();
    const close = screen.getByRole('button', { name: 'Close' });
    const last = screen.getByRole('button', { name: 'Add to calendar' });

    await user.tab();
    expect(close).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('link', { name: 'Guide' })).toHaveFocus();
    await user.tab();
    expect(last).toHaveFocus();
    await user.tab();
    expect(close).toHaveFocus();
    await user.tab({ shift: true });
    expect(last).toHaveFocus();
  });

  it('closes when the handle is dragged down far enough, not for a small drag', async () => {
    await openSheet();
    const handle = document.querySelector('[class*="handle"]') as HTMLElement;

    fireEvent.pointerDown(handle, { clientY: 100, pointerId: 1 });
    fireEvent.pointerMove(handle, { clientY: 140, pointerId: 1 });
    fireEvent.pointerUp(handle, { clientY: 140, pointerId: 1 });
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    fireEvent.pointerDown(handle, { clientY: 100, pointerId: 1 });
    fireEvent.pointerMove(handle, { clientY: 260, pointerId: 1 });
    expect(screen.getByRole('dialog').style.transform).toBe('translateY(160px)');
    fireEvent.pointerUp(handle, { clientY: 260, pointerId: 1 });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
