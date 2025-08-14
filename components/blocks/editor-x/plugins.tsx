import { useState } from "react"
import {
  CHECK_LIST,
  ELEMENT_TRANSFORMERS,
  MULTILINE_ELEMENT_TRANSFORMERS,
  TEXT_FORMAT_TRANSFORMERS,
  TEXT_MATCH_TRANSFORMERS,
} from "@lexical/markdown"
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin"
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin"
import { ClearEditorPlugin } from "@lexical/react/LexicalClearEditorPlugin"
import { ClickableLinkPlugin } from "@lexical/react/LexicalClickableLinkPlugin"
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary"
import { HashtagPlugin } from "@lexical/react/LexicalHashtagPlugin"
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin"
import { HorizontalRulePlugin } from "@lexical/react/LexicalHorizontalRulePlugin"
import { ListPlugin } from "@lexical/react/LexicalListPlugin"
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin"
import { TablePlugin } from "@lexical/react/LexicalTablePlugin"

import { ContentEditable } from "@/components/editor/editor-ui/content-editable"
import { AutoLinkPlugin } from "@/components/editor/plugins/auto-link-plugin"
import { AutocompletePlugin } from "@/components/editor/plugins/autocomplete-plugin"
import { CodeActionMenuPlugin } from "@/components/editor/plugins/code-action-menu-plugin"
import { CodeHighlightPlugin } from "@/components/editor/plugins/code-highlight-plugin"
import { CollapsiblePlugin } from "@/components/editor/plugins/collapsible-plugin"
import { ComponentPickerMenuPlugin } from "@/components/editor/plugins/component-picker-menu-plugin"
import { ContextMenuPlugin } from "@/components/editor/plugins/context-menu-plugin"
import { DragDropPastePlugin } from "@/components/editor/plugins/drag-drop-paste-plugin"
import { DraggableBlockPlugin } from "@/components/editor/plugins/draggable-block-plugin"
import { AutoEmbedPlugin } from "@/components/editor/plugins/embeds/auto-embed-plugin"
import { FigmaPlugin } from "@/components/editor/plugins/embeds/figma-plugin"
import { TwitterPlugin } from "@/components/editor/plugins/embeds/twitter-plugin"
import { YouTubePlugin } from "@/components/editor/plugins/embeds/youtube-plugin"
import { EmojiPickerPlugin } from "@/components/editor/plugins/emoji-picker-plugin"
import { EmojisPlugin } from "@/components/editor/plugins/emojis-plugin"
import { EquationsPlugin } from "@/components/editor/plugins/equations-plugin"
import { ExcalidrawPlugin } from "@/components/editor/plugins/excalidraw-plugin"
import { FloatingLinkEditorPlugin } from "@/components/editor/plugins/floating-link-editor-plugin"
import { FloatingTextFormatToolbarPlugin } from "@/components/editor/plugins/floating-text-format-plugin"
// import { ImagesPlugin } from "@/components/editor/plugins/images-plugin"
// import { InlineImagePlugin } from "@/components/editor/plugins/inline-image-plugin"
import { KeywordsPlugin } from "@/components/editor/plugins/keywords-plugin"
import { LayoutPlugin } from "@/components/editor/plugins/layout-plugin"
import { LinkPlugin } from "@/components/editor/plugins/link-plugin"
import { ListMaxIndentLevelPlugin } from "@/components/editor/plugins/list-max-indent-level-plugin"
import { MentionsPlugin } from "@/components/editor/plugins/mentions-plugin"
import { PageBreakPlugin } from "@/components/editor/plugins/page-break-plugin"
import { AlignmentPickerPlugin } from "@/components/editor/plugins/picker/alignment-picker-plugin"
import { BulletedListPickerPlugin } from "@/components/editor/plugins/picker/bulleted-list-picker-plugin"
import { CheckListPickerPlugin } from "@/components/editor/plugins/picker/check-list-picker-plugin"
import { CodePickerPlugin } from "@/components/editor/plugins/picker/code-picker-plugin"
import { CollapsiblePickerPlugin } from "@/components/editor/plugins/picker/collapsible-picker-plugin"
import { ColumnsLayoutPickerPlugin } from "@/components/editor/plugins/picker/columns-layout-picker-plugin"
import { DividerPickerPlugin } from "@/components/editor/plugins/picker/divider-picker-plugin"
import { EmbedsPickerPlugin } from "@/components/editor/plugins/picker/embeds-picker-plugin"
import { EquationPickerPlugin } from "@/components/editor/plugins/picker/equation-picker-plugin"
import { ExcalidrawPickerPlugin } from "@/components/editor/plugins/picker/excalidraw-picker-plugin"
import { HeadingPickerPlugin } from "@/components/editor/plugins/picker/heading-picker-plugin"
// import { ImagePickerPlugin } from "@/components/editor/plugins/picker/image-picker-plugin"
import { NumberedListPickerPlugin } from "@/components/editor/plugins/picker/numbered-list-picker-plugin"
import { PageBreakPickerPlugin } from "@/components/editor/plugins/picker/page-break-picker-plugin"
import { ParagraphPickerPlugin } from "@/components/editor/plugins/picker/paragraph-picker-plugin"
import { PollPickerPlugin } from "@/components/editor/plugins/picker/poll-picker-plugin"
import { QuotePickerPlugin } from "@/components/editor/plugins/picker/quote-picker-plugin"
import {
  DynamicTablePickerPlugin,
  TablePickerPlugin,
} from "@/components/editor/plugins/picker/table-picker-plugin"
import { PollPlugin } from "@/components/editor/plugins/poll-plugin"
import { TabFocusPlugin } from "@/components/editor/plugins/tab-focus-plugin"
import { TableActionMenuPlugin } from "@/components/editor/plugins/table-action-menu-plugin"
import { TableCellResizerPlugin } from "@/components/editor/plugins/table-cell-resizer-plugin"
import { TableHoverActionsPlugin } from "@/components/editor/plugins/table-hover-actions-plugin"

// import { TypingPerfPlugin } from "@/components/editor/plugins/typing-pref-plugin"
import { EMOJI } from "@/components/editor/transformers/markdown-emoji-transformer"
import { EQUATION } from "@/components/editor/transformers/markdown-equation-transformer"
import { HR } from "@/components/editor/transformers/markdown-hr-transformer"
// import { IMAGE } from "@/components/editor/transformers/markdown-image-transformer"
import { TABLE } from "@/components/editor/transformers/markdown-table-transformer"
import { TWEET } from "@/components/editor/transformers/markdown-tweet-transformer"

const placeholder = "Press / for commands..."
const maxLength = 500

export function Plugins({}) {
  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null)

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem)
    }
  }

  return (
    <div className="relative">
      <div className="relative">
        <AutoFocusPlugin />
        <RichTextPlugin
          contentEditable={
            <div className="">
              <div className="" ref={onRef}>
                <ContentEditable
                  placeholder={placeholder}
                  className="ContentEditable__root relative block min-h-[200px] h-auto overflow-auto px-8 py-4 focus:outline-none"
                />
              </div>
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />

        <ClickableLinkPlugin />
        <CheckListPlugin />
        <HorizontalRulePlugin />
        <TablePlugin />
        <ListPlugin />
        <TabIndentationPlugin />
        <HashtagPlugin />
        <HistoryPlugin />

        <MentionsPlugin />
        <PageBreakPlugin />
        <DraggableBlockPlugin anchorElem={floatingAnchorElem} />
        <KeywordsPlugin />
        <EmojisPlugin />
        {/* <ImagesPlugin />
        <InlineImagePlugin /> */}
        <ExcalidrawPlugin />
        <TableCellResizerPlugin />
        <TableHoverActionsPlugin anchorElem={floatingAnchorElem} />
        <TableActionMenuPlugin
          anchorElem={floatingAnchorElem}
          cellMerge={true}
        />
        <PollPlugin />
        <LayoutPlugin />
        <EquationsPlugin />
        <CollapsiblePlugin />

        <AutoEmbedPlugin />
        <FigmaPlugin />
        <TwitterPlugin />
        <YouTubePlugin />

        <CodeHighlightPlugin />
        <CodeActionMenuPlugin anchorElem={floatingAnchorElem} />

        <MarkdownShortcutPlugin
          transformers={[
            TABLE,
            HR,
            // IMAGE,
            EMOJI,
            EQUATION,
            TWEET,
            CHECK_LIST,
            ...ELEMENT_TRANSFORMERS,
            ...MULTILINE_ELEMENT_TRANSFORMERS,
            ...TEXT_FORMAT_TRANSFORMERS,
            ...TEXT_MATCH_TRANSFORMERS,
          ]}
        />

        <TabFocusPlugin />
        <AutocompletePlugin />
        <AutoLinkPlugin />
        <LinkPlugin />

        <ComponentPickerMenuPlugin
          baseOptions={[
            EmbedsPickerPlugin({ embed: "youtube-video" }),
            EmbedsPickerPlugin({ embed: "tweet" }),
            EmbedsPickerPlugin({ embed: "figma" }),
            DividerPickerPlugin(),
            TablePickerPlugin(),
          ]}
          dynamicOptionsFn={DynamicTablePickerPlugin}
        />

        <ContextMenuPlugin />
        <DragDropPastePlugin />
        <EmojiPickerPlugin />

        <FloatingLinkEditorPlugin anchorElem={floatingAnchorElem} />
        <FloatingTextFormatToolbarPlugin anchorElem={floatingAnchorElem} />

        <ListMaxIndentLevelPlugin />
      </div>
    </div>
  )
}
