import React, { useEffect } from "react"
import {
  InputGroup,
  InputProps,
  InputRightElement,
  useColorMode,
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
  const { colorMode } = useColorMode()

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
    }, 0)

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
          onSubmit?.(value.item.value.trim())
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
          <AutoCompleteItem
            pb={1}
            fontSize={"sm"}
            color={
              autocompleteItems.includes(searchQuery.trim())
                ? colorMode === "light"
                  ? "black"
                  : "white"
                : "gray.500"
            }
            value={searchQuery}
          >
            {searchQuery}
          </AutoCompleteItem>

          {autocompleteItems.map(
            (item, idx) =>
              item !== searchQuery && (
                <AutoCompleteItem
                  py={1}
                  fontSize={"sm"}
                  key={`option-${idx}`}
                  value={item}
                >
                  {item}
                </AutoCompleteItem>
              ),
          )}
        </AutoCompleteList>
      </AutoComplete>
      <InputRightElement
        cursor={"pointer"}
        onClick={() => onSubmit?.(searchQuery.trim())}
      >
        <BiSearch />
      </InputRightElement>
    </InputGroup>
  )
}

export default SearchInput
