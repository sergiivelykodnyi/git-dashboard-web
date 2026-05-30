import { Dropdown, DropdownItem, DropdownAction } from "./Dropdown";
import { Icon } from "./Icon";

interface Props {
  onRemove: () => void;
}

export function RepoDropdowActions(props: Readonly<Props>) {
  const { onRemove } = props;

  return (
    <Dropdown>
      <DropdownItem>
        <DropdownAction className="danger" onClick={onRemove}>
          <Icon className="menu-item-icon" name="delete" size={16} />
          Remove
        </DropdownAction>
      </DropdownItem>
    </Dropdown>
  );
}
