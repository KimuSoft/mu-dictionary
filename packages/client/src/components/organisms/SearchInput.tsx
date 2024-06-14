import React, { useEffect } from "react"
import {
  Input,
  InputGroup,
  InputProps,
  InputRightElement,
  useColorModeValue,
} from "@chakra-ui/react"
import { BiSearch } from "react-icons/bi"
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
} from "@choc-ui/chakra-autocomplete"
import { autocompleteWords } from "../../api/word"

const SearchInput: React.FC<
  {
    onChange?: (value: string) => unknown
    onSubmit?: (value: string) => unknown
  } & Omit<InputProps, "onChange" | "onSubmit">
> = ({ onChange, onSubmit, ...props }) => {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [autocompleteItems, setAutocompleteItems] = React.useState<string[]>([])

  useEffect(() => {
    if (!searchQuery) {
      console.log(searchQuery)
      return setAutocompleteItems([])
    }

    const timeout = setTimeout(async () => {
      const autocompletes = await autocompleteWords(searchQuery, 5)
      setAutocompleteItems(autocompletes)
    }, 200)

    return () => clearTimeout(timeout)
  }, [searchQuery])

  const _onChange = async (value: string) => {
    setSearchQuery(value)
    onChange?.(value)
  }

  return (
    <InputGroup w={props.w || props.width || "100%"} size={props.size}>
      <AutoComplete
        placement={"bottom"}
        emptyState={false}
        onSelectOption={(value) => {
          onSubmit?.(value.item.value)
          // _onChange(value.item.value).then()
        }}
      >
        <AutoCompleteInput
          bgColor={useColorModeValue("gray.100", "gray.700")}
          borderColor={useColorModeValue("gray.200", "gray.700")}
          onChange={(e) => _onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSubmit?.(searchQuery)
            }
          }}
          {...props}
        />
        <AutoCompleteList bgColor={useColorModeValue("gray.100", "gray.700")}>
          {autocompleteItems.map((item, idx) => (
            <AutoCompleteItem key={`option-${idx}`} value={item}>
              {item}
            </AutoCompleteItem>
          ))}
        </AutoCompleteList>
      </AutoComplete>
      <InputRightElement>
        <BiSearch />
      </InputRightElement>
    </InputGroup>
  )
}

export default SearchInput
