import React from "react"
import {
  InputGroup,
  InputProps,
  InputRightElement,
  useColorMode,
  useColorModeValue,
  useMediaQuery,
} from "@chakra-ui/react"
import { BiSearch, BiX } from "react-icons/bi"
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
} from "@choc-ui/chakra-autocomplete"
import { motion } from "framer-motion"
import { useQuery } from "@tanstack/react-query"
import { useDebounce } from "use-debounce"
import { useRouter } from "next-nprogress-bar"

import { fetchAutocomplete } from "@/api/actions/fetchAutocomplete"

export const queryAutocomplete = async ({
  queryKey,
}: {
  queryKey: [string, { query: string }]
}) => {
  return fetchAutocomplete(queryKey[1].query, 5)
}

const SearchInput: React.FC<InputProps> = (props) => {
  const { push } = useRouter()
  const { colorMode } = useColorMode()

  const [searchQuery, setSearchQuery] = React.useState("")
  const [searchQueryDebounced] = useDebounce(searchQuery, 50)

  const { data: autocompleteItems, isLoading } = useQuery({
    queryKey: ["autocomplete", { query: searchQueryDebounced }],
    queryFn: queryAutocomplete,
    initialData: [],
  })

  const onSubmit = async (value: string) => {
    if (!searchQuery) return
    push("/search?q=" + encodeURIComponent(value))
  }

  const [isMobile] = useMediaQuery("(max-width: 768px)")

  const _onChange = async (value: string) => {
    setSearchQuery(value)
  }

  return (
    <InputGroup w={props.w || props.width || "100%"} size={props.size}>
      <AutoComplete
        placement={"bottom"}
        emptyState={false}
        onSelectOption={(value) => {
          void onSubmit(value.item.value.trim())
        }}
      >
        <AutoCompleteInput
          bgColor={useColorModeValue("gray.100", "gray.700")}
          borderColor={useColorModeValue("gray.200", "gray.700")}
          onChange={(e) => _onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") void onSubmit(searchQuery)
          }}
          {...props}
        />
        <AutoCompleteList
          p={0}
          overflow={"hidden"}
          bgColor={useColorModeValue("gray.100", "gray.700")}
        >
          <AutoCompleteItem
            py={1}
            px={4}
            m={0}
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
                  as={motion.div}
                  initial={{ y: "-100%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  py={1}
                  px={4}
                  m={0}
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
      <InputRightElement>
        {searchQuery && isMobile ? (
          <BiX
            size={20}
            style={{ cursor: "pointer" }}
            onClick={() => setSearchQuery("")}
          />
        ) : (
          <BiSearch
            style={{ cursor: "pointer" }}
            onClick={() => onSubmit?.(searchQuery.trim())}
          />
        )}
      </InputRightElement>
    </InputGroup>
  )
}

export default SearchInput
