import SearchInput from "./SearchInput";

interface Props {
  onSearchInput: (searchText: string) => void;
}

const NavBar = ({ onSearchInput }: Props) => {
  return <SearchInput onSearchInput={onSearchInput} />;
};

export default NavBar;
