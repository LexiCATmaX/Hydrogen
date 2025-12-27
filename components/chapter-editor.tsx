"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Lock, Unlock } from "lucide-react"
import { ContextMenu, type MenuItem } from "./context-menu"

interface ChapterEditorProps {
  chapterId: number
}

const chaptersData: Record<number, { title: string; english: string; german: string }> = {
  1: {
    title: "Chapter 1",
    english: `There was once a fisherman who lived with his wife in a pigsty, close by the seaside. The fisherman used to go out all day long a-fishing; and one day, as he sat on the shore with his rod, looking at the sparkling waves and watching his line, all on a sudden his float was dragged away deep into the water: and in drawing it up he pulled out a great fish.

But the fish said, 'Pray let me live! I am not a real fish; I am an enchanted prince: put me in the water again, and let me go!' 'Oh, ho!' said the man, 'you need not make so many words about the matter; I will have nothing to do with a fish that can talk: so swim away, sir, as soon as you please!'

Then he put him back into the water, and the fish darted straight down to the bottom, and left a long streak of blood behind him on the wave.`,
    german: `Es war einmal ein Fischer, der lebte mit seiner Frau in einem Schweinestall, ganz nahe am Meer. Der Fischer ging jeden Tag hinaus zum Fischen; und eines Tages, als er mit seiner Angelrute am Ufer saß und auf die glitzernden Wellen schaute und seine Leine beobachtete, wurde plötzlich sein Schwimmer tief ins Wasser gezogen: und als er ihn herauszog, holte er einen großen Fisch heraus.

Aber der Fisch sagte: „Bitte lass mich leben! Ich bin kein echter Fisch; ich bin ein verzauberter Prinz: Setze mich wieder ins Wasser und lass mich gehen!" „Oh, ho!" sagte der Mann, „du brauchst nicht so viele Worte darüber zu machen; ich will nichts mit einem Fisch zu tun haben, der sprechen kann: also schwimm weg, mein Herr, sobald du willst!"

Dann setzte er ihn wieder ins Wasser, und der Fisch schoss geradewegs zum Grund hinunter und hinterließ einen langen Blutstreifen auf der Welle.`,
  },
  2: {
    title: "Chapter 2",
    english: `When the fisherman went home to his wife in the pigsty, he told her how he had caught a great fish, and how it had told him it was an enchanted prince, and how, on hearing it speak, he had let it go again. 'Did not you ask it for anything?' said the wife, 'we live very wretchedly here, in this nasty dirty pigsty; do go back and tell the fish we want a snug little cottage.'

The fisherman did not much like the business: however, he went to the seaside; and when he came back there the water looked all yellow and green. And he stood at the water's edge, and said:

'O man of the sea!
Hearken to me!
My wife Ilsabill
Will have her own will,
And hath sent me to beg a boon of thee!'`,
    german: `Als der Fischer nach Hause zu seiner Frau in den Schweinestall kam, erzählte er ihr, wie er einen großen Fisch gefangen hatte und wie dieser ihm erzählt hatte, dass er ein verzauberter Prinz sei, und wie er ihn, als er ihn sprechen hörte, wieder losgelassen hatte. „Hast du ihn nicht um etwas gebeten?" sagte die Frau, „wir leben hier sehr elend in diesem ekligen, schmutzigen Schweinestall; geh zurück und sage dem Fisch, dass wir ein gemütliches kleines Häuschen wollen."

Der Fischer mochte die Sache nicht sehr: trotzdem ging er zum Meer; und als er zurückkam, sah das Wasser ganz gelb und grün aus. Und er stand am Wasserrand und sagte:

„O Mann aus dem Meer!
Hör mir zu!
Meine Frau Ilsabill
Will ihren eigenen Willen haben,
Und hat mich geschickt, dich um eine Gunst zu bitten!"`,
  },
  3: {
    title: "Chapter 3",
    english: `Then the fish came swimming to him, and said, 'Well, what is her will? What does your wife want?' 'Ah!' said the fisherman, 'she says that when I had caught you, I ought to have asked you for something before I let you go; she does not like living any longer in the pigsty, and wants a snug little cottage.' 'Go home, then,' said the fish; 'she is in the cottage already.'

So the man went home, and saw his wife standing at the door of a nice trim little cottage. 'Come in, come in!' said she; 'is not this much better than the filthy pigsty we had?' And there was a parlour, and a bedchamber, and a kitchen; and behind the cottage there was a little garden, planted with all sorts of flowers and fruits; and there was a courtyard behind, full of ducks and chickens.`,
    german: `Dann kam der Fisch zu ihm geschwommen und sagte: „Nun, was ist ihr Wille? Was will deine Frau?" „Ach!" sagte der Fischer, „sie sagt, als ich dich gefangen hatte, hätte ich dich um etwas bitten sollen, bevor ich dich gehen ließ; sie mag es nicht mehr, im Schweinestall zu leben, und will ein gemütliches kleines Häuschen." „Geh dann nach Hause," sagte der Fisch; „sie steht schon im Häuschen."`,
  },
  4: {
    title: "Chapter 4",
    english: `'Ah!' said the fisherman, 'how happily we shall live now!' 'We will try to do so, at least,' said his wife. Everything went right for a week or two, and then Dame Ilsabill said, 'Husband, there is not near room enough for us in this cottage; the courtyard and the garden are a great deal too small; I should like to have a large stone castle to live in: go to the fish again and tell him to give us a castle.'

'Wife,' said the fisherman, 'I don't like to go to him again, for perhaps he will be angry; we ought to be easy with this pretty cottage to live in.' 'Nonsense!' said the wife; 'he will do it very willingly, I know; go along and try!'`,
    german: `„Ach!" sagte der Fischer, „wie glücklich werden wir jetzt leben!" „Das wollen wir zumindest versuchen," sagte seine Frau. Alles ging ein oder zwei Wochen gut, und dann sagte Frau Ilsabill: „Ehemann, es gibt bei weitem nicht genug Platz für uns in diesem Häuschen; der Hof und der Garten sind viel zu klein; ich möchte in einem großen Steinschloss leben: geh wieder zum Fisch und sage ihm, er soll uns ein Schloss geben."

„Frau," sagte der Fischer, „ich mag nicht wieder zu ihm gehen, denn vielleicht wird er böse sein; wir sollten mit diesem hübschen Häuschen zum Leben zufrieden sein." „Unsinn!" sagte die Frau; „er wird es sehr gerne tun, das weiß ich; geh los und versuch es!"`,
  },
  5: {
    title: "Chapter 5",
    english: `The fisherman went, but his heart was very heavy: and when he came to the sea, it looked blue and gloomy, though it was very calm; and he went close to the edge of the waves, and said:

'O man of the sea!
Hearken to me!
My wife Ilsabill
Will have her own will,
And hath sent me to beg a boon of thee!'

'Well, what does she want now?' said the fish. 'Ah!' said the man, dolefully, 'my wife wants to live in a stone castle.' 'Go home, then,' said the fish; 'she is standing at the gate of it already.'`,
    german: `Der Fischer ging, aber sein Herz war sehr schwer: und als er zum Meer kam, sah es blau und düster aus, obwohl es sehr ruhig war; und er ging nah an den Rand der Wellen und sagte:

„O Mann aus dem Meer!
Hör mir zu!
Meine Frau Ilsabill
Will ihren eigenen Willen haben,
Und hat mich geschickt, dich um eine Gunst zu bitten!"

„Nun, was will sie jetzt?" sagte der Fisch. „Ach!" sagte der Mann traurig, „meine Frau will in einem Steinschloss leben." „Geh dann nach Hause," sagte der Fisch; „sie steht schon an seinem Tor."`,
  },
}

const paragraphMenuItems: MenuItem[] = [
  { label: "Edit Manually", action: "edit-manual" },
  { label: "Edit Interactively…", action: "edit-interactive" },
  { label: "Save Variant", action: "save-variant" },
  { label: "Lock Selection", action: "lock-selection" },
  { label: "Mark as Final", action: "mark-final" },
  { label: "Mark for Review", action: "mark-review" },
  { label: "Add Comment…", action: "add-comment" },
  { divider: true },
  {
    label: "Tone",
    submenu: [
      { label: "More Formal", action: "tone-formal" },
      { label: "More Casual", action: "tone-casual" },
      { label: "More Poetic", action: "tone-poetic" },
      { label: "More Direct", action: "tone-direct" },
    ],
  },
  {
    label: "Style",
    submenu: [
      { label: "More Concise", action: "style-concise" },
      { label: "More Elaborate", action: "style-elaborate" },
      { label: "Simplify", action: "style-simplify" },
    ],
  },
  {
    label: "Length",
    submenu: [
      { label: "Expand", action: "length-expand" },
      { label: "Condense", action: "length-condense" },
    ],
  },
  { divider: true },
  {
    label: "Analysis",
    submenu: [
      { label: "Grammar Check", action: "analysis-grammar" },
      { label: "Style Analysis", action: "analysis-style" },
      { label: "Readability Score", action: "analysis-readability" },
      { label: "Compare Versions", action: "analysis-compare" },
    ],
  },
  {
    label: "AI Assist",
    submenu: [
      { label: "Suggest Alternatives", action: "ai-alternatives" },
      { label: "Explain Translation", action: "ai-explain" },
      { label: "Cultural Notes", action: "ai-cultural" },
    ],
  },
]

const partialMenuItems: MenuItem[] = [
  { label: "Edit using AI", action: "edit-ai" },
  { label: "Edit manually", action: "edit-manual" },
  { label: "Rephrase suggestions", action: "rephrase" },
  { label: "Interactive rephrase", action: "interactive-rephrase" },
  { divider: true },
  { label: "Add term", action: "add-term" },
  { divider: true },
  { label: "Delete", action: "delete" },
  { label: "Delete and clean-up", action: "delete-cleanup" },
]

export function ChapterEditor({ chapterId }: ChapterEditorProps) {
  const chapter = chaptersData[chapterId] || chaptersData[1]

  const [englishText, setEnglishText] = useState(chapter.english)
  const [germanText, setGermanText] = useState(chapter.german)
  const [selectedParagraph, setSelectedParagraph] = useState<{ index: number; panel: "english" | "german" } | null>(
    null,
  )
  const [isSourceLocked, setIsSourceLocked] = useState(true)
  const [contextMenu, setContextMenu] = useState<{
    x: number
    y: number
    type: "paragraph" | "partial"
    panel: "english" | "german"
  } | null>(null)

  const englishRef = useRef<HTMLTextAreaElement>(null)
  const germanRef = useRef<HTMLTextAreaElement>(null)

  const englishParagraphs = englishText.split("\n\n")
  const germanParagraphs = germanText.split("\n\n")

  useEffect(() => {
    const newChapter = chaptersData[chapterId] || chaptersData[1]
    setEnglishText(newChapter.english)
    setGermanText(newChapter.german)
    setSelectedParagraph(null)
  }, [chapterId])

  const handlePaneClick = (e: React.MouseEvent) => {
    if (e.button === 0) {
      // Left click only
      setSelectedParagraph(null)
    }
  }

  const handleDoubleClick = (e: React.MouseEvent<HTMLTextAreaElement>, panel: "english" | "german") => {
    const textarea = e.currentTarget
    const paragraphs = panel === "english" ? englishParagraphs : germanParagraphs

    // Find which paragraph was clicked
    let charCount = 0
    for (let i = 0; i < paragraphs.length; i++) {
      const paragraphLength = paragraphs[i].length + 2 // +2 for \n\n
      if (textarea.selectionStart < charCount + paragraphLength) {
        setSelectedParagraph({ index: i, panel })
        return
      }
      charCount += paragraphLength
    }
  }

  const handleContextMenu = (e: React.MouseEvent<HTMLTextAreaElement>, panel: "english" | "german") => {
    e.preventDefault()
    e.stopPropagation()

    const textarea = e.currentTarget
    const { selectionStart, selectionEnd } = textarea
    const paragraphs = panel === "english" ? englishParagraphs : germanParagraphs

    // Find which paragraph was right-clicked
    let charCount = 0
    let clickedIndex = 0
    for (let i = 0; i < paragraphs.length; i++) {
      const paragraphLength = paragraphs[i].length + 2
      if (selectionStart < charCount + paragraphLength) {
        clickedIndex = i
        break
      }
      charCount += paragraphLength
    }

    // If clicking on the selected paragraph (in either pane), show paragraph menu
    if (selectedParagraph !== null && clickedIndex === selectedParagraph.index) {
      setContextMenu({
        x: e.clientX,
        y: e.clientY,
        type: "paragraph",
        panel,
      })
      return
    }

    // Otherwise check if there's a selection
    if (selectionStart !== selectionEnd) {
      const selectedText = textarea.value.substring(selectionStart, selectionEnd).trim()
      const isFullParagraph = paragraphs.some((p) => p.trim() === selectedText)

      if (isFullParagraph) {
        setSelectedParagraph({ index: clickedIndex, panel })
      }

      setContextMenu({
        x: e.clientX,
        y: e.clientY,
        type: isFullParagraph ? "paragraph" : "partial",
        panel,
      })
    }
  }

  const handleMenuClose = () => {
    setContextMenu(null)
  }

  const handleMenuAction = (action: string) => {
    console.log("Menu action:", action)
    handleMenuClose()
  }

  const getMenuItems = (type: "paragraph" | "partial", panel: "english" | "german") => {
    const items = type === "paragraph" ? paragraphMenuItems : partialMenuItems
    if (panel === "english" && isSourceLocked) {
      return items.map((item) => {
        if ("divider" in item) return item
        if (item.action === "add-term") return item
        return { ...item, disabled: true }
      })
    }
    return items
  }

  const renderParagraph = (paragraph: string, index: number, isOppositePane: boolean) => {
    const isSelected =
      selectedParagraph !== null &&
      selectedParagraph.index === index &&
      ((isOppositePane && selectedParagraph.panel !== (isOppositePane ? "german" : "english")) ||
        (!isOppositePane && selectedParagraph.panel === (isOppositePane ? "german" : "english")))

    return (
      <div key={index} className={`${isSelected ? "bg-blue-200" : ""}`}>
        {paragraph}
        {index < (isOppositePane ? germanParagraphs.length : englishParagraphs.length) - 1 && "\n\n"}
      </div>
    )
  }

  return (
    <div className="flex-1 h-full p-4 grid grid-cols-2 gap-4">
      {/* English Panel */}
      <div className="flex flex-col gap-2 h-full min-h-0">
        <div className="flex items-center gap-2 flex-shrink-0">
          <h2 className="text-sm font-semibold text-foreground">English</h2>
          <button
            onClick={() => setIsSourceLocked(!isSourceLocked)}
            className="p-1 rounded hover:bg-accent transition-colors"
            title={isSourceLocked ? "Unlock source text" : "Lock source text"}
          >
            {isSourceLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
          </button>
        </div>
        <div className="flex-1 min-h-0 border rounded-md overflow-auto">
          <div className="relative min-h-full">
            {/* Background highlight overlay - in normal flow to define scroll height */}
            <div className="p-3 text-sm leading-relaxed whitespace-pre-wrap pointer-events-none select-none">
              {englishParagraphs.map((p, i) => renderParagraph(p, i, false))}
            </div>
            {/* Foreground textarea - absolute to overlay the highlights, overflow-hidden so parent controls scroll */}
            <Textarea
              ref={englishRef}
              value={englishText}
              onChange={(e) => !isSourceLocked && setEnglishText(e.target.value)}
              onClick={handlePaneClick}
              onDoubleClick={(e) => handleDoubleClick(e, "english")}
              onContextMenu={(e) => handleContextMenu(e, "english")}
              readOnly={isSourceLocked}
              className="absolute inset-0 resize-none text-sm leading-relaxed bg-transparent p-3 border-0 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:border-input overflow-hidden"
            />
          </div>
        </div>
      </div>

      {/* German Panel */}
      <div className="flex flex-col gap-2 h-full min-h-0">
        <h2 className="text-sm font-semibold text-foreground flex-shrink-0">German</h2>
        <div className="flex-1 min-h-0 border rounded-md overflow-auto">
          <div className="relative min-h-full">
            {/* Background highlight overlay - in normal flow to define scroll height */}
            <div className="p-3 text-sm leading-relaxed whitespace-pre-wrap pointer-events-none select-none">
              {germanParagraphs.map((p, i) => renderParagraph(p, i, true))}
            </div>
            {/* Foreground textarea - absolute to overlay the highlights, overflow-hidden so parent controls scroll */}
            <Textarea
              ref={germanRef}
              value={germanText}
              onChange={(e) => setGermanText(e.target.value)}
              onClick={handlePaneClick}
              onDoubleClick={(e) => handleDoubleClick(e, "german")}
              onContextMenu={(e) => handleContextMenu(e, "german")}
              className="absolute inset-0 resize-none text-sm leading-relaxed bg-transparent p-3 border-0 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:border-input overflow-hidden"
            />
          </div>
        </div>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          items={getMenuItems(contextMenu.type, contextMenu.panel)}
          onAction={handleMenuAction}
          onClose={handleMenuClose}
        />
      )}
    </div>
  )
}
