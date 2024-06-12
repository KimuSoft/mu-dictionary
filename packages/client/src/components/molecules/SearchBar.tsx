import React from "react"
import { BiSearch } from "react-icons/all"
import styled from "styled-components"

const SearchBarBorderBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  padding: 0 20px;
  gap: 10px;

  width: 100%;
  height: 48px;

  /* tailwind/white */
  border: 2px solid #ffffff;
  border-radius: 100px;
`

const SearchInput = styled.input`
  width: 100%;
  background-color: transparent;
  border: none;
  font-size: 18px;
  color: #ffffff;
  outline: none;
  -webkit-box-shadow: none;
  -moz-box-shadow: none;
  box-shadow: none;
`

const SearchButton = styled(BiSearch)`
  width: 28px;
  height: 28px;
  transition: all 0.2s ease-out;
  cursor: pointer;

  &:hover {
    color: rgba(147, 197, 253, 0.4);
  }
`

const SearchBar: React.FC<{
  defaultValue?: string
  onSubmit?(keyword: string): Promise<void>
}> = ({ defaultValue, onSubmit }) => {
  const [keyword, setKeyword] = React.useState("")

  const submit = () => {
    console.log(keyword)
    if (onSubmit) onSubmit(keyword).then()
  }

  return (
    <SearchBarBorderBox>
      <SearchInput
        defaultValue={defaultValue}
        onChange={(e) => {
          setKeyword(e.target.value)
        }}
        onKeyPress={(e) => {
          if (e.key === "Enter") submit()
        }}
      />
      <SearchButton onClick={submit} />
    </SearchBarBorderBox>
  )
}

export default SearchBar
