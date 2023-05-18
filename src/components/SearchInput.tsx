import { Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { useRef } from "react";
import { BsSearch } from "react-icons/bs";

interface Props {
  onSearchInput: (searchText: string) => void;
}

const SearchInput = ({ onSearchInput }: Props) => {
  const ref = useRef<HTMLInputElement>(null);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();

        if (ref.current) {
          onSearchInput(ref.current.value);
        }
      }}
    >
      <InputGroup
        marginTop="10px"
        backgroundColor="white"
        borderRadius={15}
        width={500}
        border="1px solid gray"
      >
        <InputLeftElement children={<BsSearch />} />
        <Input
          name="Name"
          ref={ref}
          borderRadius={15}
          placeholder="Search files..."
          variant="filled"
        />
      </InputGroup>
    </form>
  );
};

export default SearchInput;
