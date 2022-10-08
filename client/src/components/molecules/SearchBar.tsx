import React from "react"
import { BiSearch } from "react-icons/all"
import { useNavigate } from "react-router-dom"
import styled from "styled-components"

const SearchBarBorderBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  padding: 0 20px;
  gap: 10px;

  width: 700px;
  height: 55px;

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
  width: 32px;
  height: 32px;
  transition: all 0.2s ease-out;
  cursor: pointer;

  &:hover {
    color: rgba(147, 197, 253, 0.4);
  }
`

const SearchBar: React.FC = () => {
  const [keyword, setKeyword] = React.useState("")
  const navigate = useNavigate()

  const onSearch = () => {
    if (!keyword) return
    navigate("/search/" + keyword)
  }

  return (
    <SearchBarBorderBox>
      <SearchInput
        onChange={(e) => {
          setKeyword(e.target.value)
        }}
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            onSearch()
          }
        }}
      />
      <SearchButton onClick={onSearch} />
    </SearchBarBorderBox>
  )
}

export default SearchBar
