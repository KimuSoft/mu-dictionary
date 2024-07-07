import React from "react"
import {
  forwardRef,
  Tag,
  TagLabel,
  TagLeftIcon,
  TagProps,
} from "@chakra-ui/react"
import getTagData from "../../utils/getTagData"

const ThemeTag = forwardRef<TagProps & { tag: string }, "div">(
  ({ tag, ...props }, ref) => {
    const tagData = getTagData(tag)

    return (
      <Tag
        colorScheme={tagData.color}
        size={"sm"}
        flexShrink={0}
        ref={ref}
        {...props}
      >
        {tagData.icon && <TagLeftIcon as={tagData.icon} />}
        <TagLabel>{tagData.name}</TagLabel>
      </Tag>
    )
  },
)

export default ThemeTag
