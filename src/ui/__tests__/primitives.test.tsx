import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import {
  ActionBar,
  ActionBarDivider,
  ActionButton,
  Badge,
  Frame,
  Icon,
  ParchmentCard,
  Tooltip,
} from '..';

describe('ActionBar / ActionButton', () => {
  it('renders a labelled nav with slots that always show their label', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <ActionBar>
          <ActionButton icon="day" label="Day" keybind="1" to="/day" active />
          <ActionButton icon="week" label="Week" keybind="2" to="/week" />
          <ActionBarDivider />
          <ActionButton
            icon="version"
            label="Version"
            keybind="V"
            onClick={onClick}
            aria-expanded={false}
          />
        </ActionBar>
      </MemoryRouter>,
    );

    expect(screen.getByRole('navigation', { name: 'Views and actions' })).toBeInTheDocument();
    const day = screen.getByRole('link', { name: 'Day' });
    expect(day).toHaveAttribute('aria-current', 'page');
    expect(day).toHaveAttribute('aria-keyshortcuts', '1');
    expect(screen.getByRole('link', { name: 'Week' })).not.toHaveAttribute('aria-current');

    const version = screen.getByRole('button', { name: 'Version' });
    expect(version).toHaveAttribute('type', 'button');
    expect(version).toHaveAttribute('aria-expanded', 'false');
    await user.click(version);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('marks an active button with aria-current', () => {
    render(<ActionButton icon="month" label="Month" active />);
    expect(screen.getByRole('button', { name: 'Month' })).toHaveAttribute('aria-current', 'true');
  });
});

describe('Tooltip', () => {
  it('describes its trigger and shows on focus / hover, hides on blur and Escape', async () => {
    const user = userEvent.setup();
    const onFocus = vi.fn();
    render(
      <Tooltip content="Not yet confirmed">
        <button type="button" aria-describedby="other" onFocus={onFocus}>
          Info
        </button>
      </Tooltip>,
    );
    const trigger = screen.getByRole('button', { name: 'Info' });
    const tip = screen.getByRole('tooltip', { hidden: true });

    expect(trigger.getAttribute('aria-describedby')).toBe(`other ${tip.id}`);
    expect(tip).not.toHaveAttribute('data-open');

    await user.tab();
    expect(tip).toHaveAttribute('data-open');
    expect(onFocus).toHaveBeenCalled();
    await user.keyboard('{Escape}');
    expect(tip).not.toHaveAttribute('data-open');

    await user.hover(trigger);
    expect(tip).toHaveAttribute('data-open');
    await user.unhover(trigger);
    expect(tip).not.toHaveAttribute('data-open');

    await user.click(trigger);
    await user.tab();
    expect(tip).not.toHaveAttribute('data-open');
  });
});

describe('static primitives', () => {
  it('Badge exposes a label for symbol-only seals', () => {
    render(
      <>
        <Badge tone="unconfirmed">Unconfirmed</Badge>
        <Badge variant="seal" label="Unconfirmed date">
          ?
        </Badge>
      </>,
    );
    expect(screen.getByText('Unconfirmed')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Unconfirmed date' })).toBeInTheDocument();
  });

  it('Icon is decorative unless titled', () => {
    const { container } = render(
      <>
        <Icon name="day" />
        <Icon name="info" title="Info" />
      </>,
    );
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByRole('img', { name: 'Info' })).toBeInTheDocument();
  });

  it('Frame and ParchmentCard render semantic elements', () => {
    render(
      <>
        <Frame as="aside" aria-label="Frame">
          Inside
        </Frame>
        <ParchmentCard title="Card" level={3} compact>
          Body
        </ParchmentCard>
      </>,
    );
    expect(screen.getByRole('complementary', { name: 'Frame' })).toHaveTextContent('Inside');
    expect(screen.getByRole('heading', { level: 3, name: 'Card' })).toBeInTheDocument();
  });
});
