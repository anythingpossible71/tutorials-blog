"use client"

import {
  InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer"
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin"
import { EditorState, SerializedEditorState } from "lexical"
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link"
import { INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND } from "@lexical/list"
import { $createHeadingNode, $createQuoteNode } from "@lexical/rich-text"
import { $createParagraphNode } from "lexical"
import { $setBlocksType } from "@lexical/selection"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { mergeRegister, $getNearestNodeOfType } from "@lexical/utils"
import {
  $getSelection,
  $isParagraphNode,
  $isRangeSelection,
  $isTextNode,
  COMMAND_PRIORITY_LOW,
  FORMAT_TEXT_COMMAND,
  LexicalEditor,
  SELECTION_CHANGE_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  INDENT_CONTENT_COMMAND,
  OUTDENT_CONTENT_COMMAND,
  ElementFormatType,
} from "lexical"
import {
  BoldIcon,
  ItalicIcon,
  LinkIcon,
  UnderlineIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  ListIcon,
  ListOrderedIcon,
  ChevronDownIcon,
  TextIcon,
  QuoteIcon,
  AlignLeftIcon,
  AlignCenterIcon,
  AlignRightIcon,
  AlignJustifyIcon,
  IndentDecreaseIcon,
  IndentIncreaseIcon,
  PlusIcon,
} from "lucide-react"

import { FloatingLinkContext } from "@/components/editor/context/floating-link-context"
import { SharedAutocompleteContext } from "@/components/editor/context/shared-autocomplete-context"
import { editorTheme } from "@/components/editor/themes/editor-theme"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { useState, useEffect, useCallback } from "react"
import { nodes } from "./nodes"
import { Plugins } from "./plugins"
import { blockTypeToBlockName } from "@/components/editor/plugins/toolbar/block-format/block-format-data"
import { ComponentPickerMenuPlugin, triggerComponentPickerMenu } from "@/components/editor/plugins/component-picker-menu-plugin"


const editorConfig: InitialConfigType = {
  namespace: "Editor",
  theme: editorTheme,
  nodes,
  onError: (error: Error) => {
    console.error(error)
  },
}

// Toolbar component with the same buttons as floating menu
function EditorToolbar() {
  const [editor] = useLexicalComposerContext()

  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [isUnderline, setIsUnderline] = useState(false)
  const [isLink, setIsLink] = useState(false)
  const [elementFormat, setElementFormat] = useState<"left" | "center" | "right" | "justify">("left")
  const [blockType, setBlockType] = useState<string>("paragraph")


  const updateToolbar = useCallback(() => {
    try {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        setIsBold(selection.hasFormat("bold"))
        setIsItalic(selection.hasFormat("italic"))
        setIsUnderline(selection.hasFormat("underline"))
        
        // Update link state
        const node = getSelectedNode(selection)
        const parent = node.getParent()
        if ($isLinkNode(parent) || $isLinkNode(node)) {
          setIsLink(true)
        } else {
          setIsLink(false)
        }

        // Update block type
        const anchorNode = selection.anchor.getNode()
        const element = anchorNode.getTopLevelElementOrThrow()
        const type = element.getType()
        
        if (type in blockTypeToBlockName) {
          setBlockType(type as keyof typeof blockTypeToBlockName)
        }


      }
    } catch (error) {
      // Editor not ready yet, ignore errors
      console.log("Editor not ready for toolbar update:", error)
    }
  }, [])

  useEffect(() => {
    // Only register listeners when editor is ready
    if (!editor) return
    
    return mergeRegister(
      editor.registerUpdateListener(() => {
        updateToolbar()
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateToolbar()
          return false
        },
        COMMAND_PRIORITY_LOW
      )
    )
  }, [editor, updateToolbar])

  const insertLink = useCallback(() => {
    if (!isLink) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, "https://")
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null)
    }
  }, [editor, isLink])



  return (
    <div className="sticky top-0 z-10 flex items-center gap-2 overflow-auto border-b bg-background p-2">


      {/* Text Formatting */}
      <ToggleGroup
        type="multiple"
        value={[
          isBold ? "bold" : "",
          isItalic ? "italic" : "",
          isUnderline ? "underline" : "",
          isLink ? "link" : "",
        ].filter(Boolean)}
      >
        <ToggleGroupItem
          value="bold"
          aria-label="Toggle bold"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")
            editor.focus()
          }}
          onMouseDown={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
          size="sm"
        >
          <BoldIcon className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem
          value="italic"
          aria-label="Toggle italic"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")
            editor.focus()
          }}
          onMouseDown={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
          size="sm"
        >
          <ItalicIcon className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem
          value="underline"
          aria-label="Toggle underline"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")
            editor.focus()
          }}
          onMouseDown={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
          size="sm"
        >
          <UnderlineIcon className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem
          value="link"
          aria-label="Toggle link"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            insertLink()
            editor.focus()
          }}
          onMouseDown={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
          size="sm"
        >
          <LinkIcon className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>
      
      <Separator orientation="vertical" className="h-6" />
      
      {/* Block Format Dropdown */}
      <Select 
        value={blockType}
        onValueChange={(value) => {
          editor.update(() => {
            const selection = $getSelection()
            if ($isRangeSelection(selection)) {
              switch (value) {
                case "paragraph":
                  $setBlocksType(selection, () => $createParagraphNode())
                  break
                case "h1":
                case "h2":
                case "h3":
                  $setBlocksType(selection, () => $createHeadingNode(value))
                  break
                case "bullet":
                  editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
                  break
                case "number":
                  editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
                  break
                case "quote":
                  $setBlocksType(selection, () => $createQuoteNode())
                  break
              }
            }
          })
          editor.focus()
        }}
      >
        <SelectTrigger className="!h-8 w-min gap-1">
          {blockTypeToBlockName[blockType]?.icon || <TextIcon className="h-4 w-4" />}
          <span>{blockTypeToBlockName[blockType]?.label || "Paragraph"}</span>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="paragraph">
              <div className="flex items-center gap-2">
                <TextIcon className="h-4 w-4" />
                <span>Paragraph</span>
              </div>
            </SelectItem>
            <SelectItem value="h1">
              <div className="flex items-center gap-2">
                <Heading1Icon className="h-4 w-4" />
                <span>Heading 1</span>
              </div>
            </SelectItem>
            <SelectItem value="h2">
              <div className="flex items-center gap-2">
                <Heading2Icon className="h-4 w-4" />
                <span>Heading 2</span>
              </div>
            </SelectItem>
            <SelectItem value="h3">
              <div className="flex items-center gap-2">
                <Heading3Icon className="h-4 w-4" />
                <span>Heading 3</span>
              </div>
            </SelectItem>
            <SelectItem value="bullet">
              <div className="flex items-center gap-2">
                <ListIcon className="h-4 w-4" />
                <span>Bullet List</span>
              </div>
            </SelectItem>
            <SelectItem value="number">
              <div className="flex items-center gap-2">
                <ListOrderedIcon className="h-4 w-4" />
                <span>Numbered List</span>
              </div>
            </SelectItem>
            <SelectItem value="quote">
              <div className="flex items-center gap-2">
                <QuoteIcon className="h-4 w-4" />
                <span>Quote</span>
              </div>
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      {/* Insert Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          // Get button position for menu positioning
          const rect = e.currentTarget.getBoundingClientRect()
          // Trigger the component picker menu directly with position
          triggerComponentPickerMenu(rect.left, rect.top)
          editor.focus()
        }}
        onMouseDown={(e) => {
          e.preventDefault()
          e.stopPropagation()
        }}
        className="h-8 px-2"
      >
        <PlusIcon className="h-4 w-4" />
      </Button>


      <Separator orientation="vertical" className="h-6" />

      {/* Alignment Controls */}
      <ToggleGroup
        type="single"
        value={elementFormat}
        onValueChange={(value) => {
          if (value) {
            setElementFormat(value as "left" | "center" | "right" | "justify")
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, value as ElementFormatType)
            editor.focus()
          }
        }}
      >
        <ToggleGroupItem 
          value="left" 
          aria-label="Left align" 
          size="sm"
          onMouseDown={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
        >
          <AlignLeftIcon className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="center" 
          aria-label="Center align" 
          size="sm"
          onMouseDown={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
        >
          <AlignCenterIcon className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="right" 
          aria-label="Right align" 
          size="sm"
          onMouseDown={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
        >
          <AlignRightIcon className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="justify" 
          aria-label="Justify align" 
          size="sm"
          onMouseDown={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
        >
          <AlignJustifyIcon className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>

      <Separator orientation="vertical" className="h-6" />

      {/* Indentation Controls */}
      <div className="flex gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            editor.update(() => {
              const selection = $getSelection()
              if ($isRangeSelection(selection)) {
                // Always decrease indent (move text left) regardless of text direction
                editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined)
              }
            })
            editor.focus()
          }}
          onMouseDown={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
          aria-label="Decrease indent (move left)"
        >
          <IndentDecreaseIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            editor.update(() => {
              const selection = $getSelection()
              if ($isRangeSelection(selection)) {
                // Always increase indent (move text right) regardless of text direction
                editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined)
              }
            })
            editor.focus()
          }}
          onMouseDown={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
          aria-label="Increase indent (move right)"
        >
          <IndentIncreaseIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

// Helper function to get selected node
function getSelectedNode(selection: any) {
  const anchor = selection.anchor
  const focus = selection.focus
  const anchorNode = selection.anchor.getNode()
  const focusNode = selection.focus.getNode()
  if (anchor.key === focus.key) {
    return anchorNode
  }
  const isBackward = selection.isBackward()
  if (isBackward) {
    return $isAtNodeEnd(focus) ? anchorNode : focusNode
  } else {
    return $isAtNodeEnd(anchor) ? focusNode : anchorNode
  }
}

// Helper function to check if at node end
function $isAtNodeEnd(point: any) {
  return point.offset === point.getNode().getTextContentSize()
}

// Plugin to focus cursor at the beginning when editor loads
function FocusPlugin() {
  const [editor] = useLexicalComposerContext()
  
  useEffect(() => {
    // Focus the editor and place cursor at the beginning
    editor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        const rootElement = editor.getRootElement()
        if (rootElement) {
          const firstTextNode = rootElement.querySelector('[data-lexical-text="true"]')
          if (firstTextNode) {
            selection.setTextNodeRange(
              firstTextNode as any,
              0,
              firstTextNode as any,
              0
            )
          }
        }
      }
    })
    editor.focus()
  }, [editor])

  return null
}

export function Editor({
  editorState,
  editorSerializedState,
  onChange,
  onSerializedChange,
}: {
  editorState?: EditorState
  editorSerializedState?: SerializedEditorState
  onChange?: (editorState: EditorState) => void
  onSerializedChange?: (editorSerializedState: SerializedEditorState) => void
}) {
  return (
    <div className="bg-background overflow-hidden rounded-lg border shadow">
      <LexicalComposer
        initialConfig={{
          ...editorConfig,
          ...(editorState ? { editorState } : {}),
          ...(editorSerializedState
            ? { editorState: JSON.stringify(editorSerializedState) }
            : {}),
        }}
      >
        <TooltipProvider>
          <SharedAutocompleteContext>
            <FloatingLinkContext>
              <EditorToolbar />
              <Plugins />
              <FocusPlugin />

              <OnChangePlugin
                ignoreSelectionChange={true}
                onChange={(editorState) => {
                  onChange?.(editorState)
                  onSerializedChange?.(editorState.toJSON())
                }}
              />
            </FloatingLinkContext>
          </SharedAutocompleteContext>
        </TooltipProvider>
      </LexicalComposer>
    </div>
  )
}
