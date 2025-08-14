"use client"

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { JSX, useCallback, useMemo, useState, createContext, useContext } from "react"
import dynamic from "next/dynamic"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { useBasicTypeaheadTriggerMatch } from "@lexical/react/LexicalTypeaheadMenuPlugin"
import { TextNode } from "lexical"
import { createPortal } from "react-dom"

import { useEditorModal } from "@/components/editor/editor-hooks/use-modal"
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

import { ComponentPickerOption } from "./picker/component-picker-option"

const LexicalTypeaheadMenuPlugin = dynamic(
  () => import("./default/lexical-typeahead-menu-plugin"),
  { ssr: false }
)

// Context to share component picker state
const ComponentPickerContext = createContext<{
  showMenu: () => void
  hideMenu: () => void
  isVisible: boolean
} | null>(null)

export const useComponentPicker = () => {
  const context = useContext(ComponentPickerContext)
  if (!context) {
    throw new Error("useComponentPicker must be used within ComponentPickerMenuPlugin")
  }
  return context
}

export function ComponentPickerMenuPlugin({
  baseOptions = [],
  dynamicOptionsFn,
}: {
  baseOptions?: Array<ComponentPickerOption>
  dynamicOptionsFn?: ({
    queryString,
  }: {
    queryString: string
  }) => Array<ComponentPickerOption>
}): JSX.Element {
  const [editor] = useLexicalComposerContext()
  const [modal, showModal] = useEditorModal()
  const [queryString, setQueryString] = useState<string | null>(null)
  const [isMenuVisible, setIsMenuVisible] = useState(false)

  const checkForTriggerMatch = useBasicTypeaheadTriggerMatch("/", {
    minLength: 0,
  })

  const options = useMemo(() => {
    if (!queryString) {
      return baseOptions
    }

    const regex = new RegExp(queryString, "i")

    return [
      ...(dynamicOptionsFn?.({ queryString }) || []),
      ...baseOptions.filter(
        (option) =>
          regex.test(option.title) ||
          option.keywords.some((keyword) => regex.test(keyword))
      ),
    ]
  }, [editor, queryString, showModal])

  const onSelectOption = useCallback(
    (
      selectedOption: ComponentPickerOption,
      nodeToRemove: TextNode | null,
      closeMenu: () => void,
      matchingString: string
    ) => {
      editor.update(() => {
        nodeToRemove?.remove()
        selectedOption.onSelect(matchingString, editor, showModal)
        closeMenu()
      })
      setIsMenuVisible(false)
    },
    [editor]
  )

  const showMenu = useCallback(() => {
    setIsMenuVisible(true)
    setQueryString("")
  }, [])

  const hideMenu = useCallback(() => {
    setIsMenuVisible(false)
    setQueryString(null)
  }, [])

  const contextValue = useMemo(() => ({
    showMenu,
    hideMenu,
    isVisible: isMenuVisible,
  }), [showMenu, hideMenu, isMenuVisible])

  return (
    <ComponentPickerContext.Provider value={contextValue}>
      {modal}
      {/* @ts-ignore */}
      <LexicalTypeaheadMenuPlugin<ComponentPickerOption>
        onQueryChange={setQueryString}
        onSelectOption={onSelectOption}
        triggerFn={checkForTriggerMatch}
        options={options}
        menuRenderFn={(
          anchorElementRef,
          { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex }
        ) => {
          return anchorElementRef.current && options.length
            ? createPortal(
                <div className="fixed w-[250px] rounded-md shadow-md">
                  <Command
                    onKeyDown={(e) => {
                      if (e.key === "ArrowUp") {
                        e.preventDefault()
                        setHighlightedIndex(
                          selectedIndex !== null
                            ? (selectedIndex - 1 + options.length) %
                                options.length
                            : options.length - 1
                        )
                      } else if (e.key === "ArrowDown") {
                        e.preventDefault()
                        setHighlightedIndex(
                          selectedIndex !== null
                            ? (selectedIndex + 1) % options.length
                            : 0
                        )
                      }
                    }}
                  >
                    <CommandList>
                      <CommandGroup>
                        {options.map((option, index) => (
                          <CommandItem
                            key={option.key}
                            value={option.title}
                            onSelect={() => {
                              selectOptionAndCleanUp(option)
                            }}
                            className={`flex items-center gap-2 ${
                              selectedIndex === index
                                ? "bg-accent"
                                : "!bg-transparent"
                            }`}
                          >
                            {option.icon}
                            {option.title}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </div>,
                document.body
              )
            : null
        }}
      />
      
      {/* Programmatic menu trigger */}
      {isMenuVisible && (
        createPortal(
          <div className="fixed inset-0 z-50" onClick={hideMenu}>
            <div 
              className="fixed w-[250px] rounded-md shadow-md bg-background border"
              style={{
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <Command>
                <CommandList>
                  <CommandGroup>
                    {options.map((option, index) => (
                      <CommandItem
                        key={option.key}
                        value={option.title}
                        onSelect={() => {
                          option.onSelect("", editor, showModal)
                          hideMenu()
                        }}
                        className="flex items-center gap-2"
                      >
                        {option.icon}
                        {option.title}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </div>
          </div>,
          document.body
        )
      )}
    </ComponentPickerContext.Provider>
  )
}
