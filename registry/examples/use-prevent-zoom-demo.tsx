"use client"

import { useRef, useState } from "react"
import {
  KeyboardIcon,
  LockIcon,
  MousePointerIcon,
  SmartphoneIcon,
  UnlockIcon,
  ZoomInIcon,
  ZoomOutIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { usePreventZoom } from "registry/hooks/use-prevent-zoom"

const images = [
  {
    src: "https://placehold.co/400x400/2563eb/ffffff?text=Image+1",
    alt: "Image 1",
  },
  {
    src: "https://placehold.co/400x400/2563eb/ffffff?text=Image+2",
    alt: "Image 2",
  },
  {
    src: "https://placehold.co/400x400/2563eb/ffffff?text=Image+3",
    alt: "Image 3",
  },
  {
    src: "https://placehold.co/400x400/2563eb/ffffff?text=Image+4",
    alt: "Image 4",
  },
]

export default function UsePreventZoomDemo() {
  const { disableGlobal, enableGlobal, isGlobalDisabled, toggleGlobal } =
    usePreventZoom({ global: true })

  const modalRef = useRef<HTMLDivElement>(null)
  const galleryRef = useRef<HTMLDivElement>(null)
  const textEditorRef = useRef<HTMLDivElement>(null)

  const [modalZoomEnabled, setModalZoomEnabled] = useState(false)
  const [galleryZoomEnabled, setGalleryZoomEnabled] = useState(false)
  const [textEditorZoomEnabled, setTextEditorZoomEnabled] = useState(false)

  const [modalCleanup, setModalCleanup] = useState<(() => void) | null>(null)
  const [galleryCleanup, setGalleryCleanup] = useState<(() => void) | null>(
    null
  )
  const [textEditorCleanup, setTextEditorCleanup] = useState<
    (() => void) | null
  >(null)

  const enableZoomForSection = (enabled: boolean) => {
    if (enabled) {
      enableGlobal()
    } else {
      disableGlobal()
    }
  }

  const toggleModalZoom = () => {
    const newState = !modalZoomEnabled
    setModalZoomEnabled(newState)

    if (newState) {
      if (modalRef.current) {
        const handleMouseEnter = () => enableZoomForSection(true)
        const handleMouseLeave = () => enableZoomForSection(false)

        modalRef.current.addEventListener("mouseenter", handleMouseEnter)
        modalRef.current.addEventListener("mouseleave", handleMouseLeave)

        setModalCleanup(() => () => {
          if (modalRef.current) {
            modalRef.current.removeEventListener("mouseenter", handleMouseEnter)
            modalRef.current.removeEventListener("mouseleave", handleMouseLeave)
          }
        })
      }
    } else {
      modalCleanup?.()
      setModalCleanup(null)
      disableGlobal()
    }
  }

  const toggleGalleryZoom = () => {
    const newState = !galleryZoomEnabled
    setGalleryZoomEnabled(newState)

    if (newState) {
      if (galleryRef.current) {
        const handleMouseEnter = () => enableZoomForSection(true)
        const handleMouseLeave = () => enableZoomForSection(false)

        galleryRef.current.addEventListener("mouseenter", handleMouseEnter)
        galleryRef.current.addEventListener("mouseleave", handleMouseLeave)

        setGalleryCleanup(() => () => {
          if (galleryRef.current) {
            galleryRef.current.removeEventListener(
              "mouseenter",
              handleMouseEnter
            )
            galleryRef.current.removeEventListener(
              "mouseleave",
              handleMouseLeave
            )
          }
        })
      }
    } else {
      galleryCleanup?.()
      setGalleryCleanup(null)
      disableGlobal()
    }
  }

  const toggleTextEditorZoom = () => {
    const newState = !textEditorZoomEnabled
    setTextEditorZoomEnabled(newState)

    if (newState) {
      if (textEditorRef.current) {
        const handleMouseEnter = () => enableZoomForSection(true)
        const handleMouseLeave = () => enableZoomForSection(false)

        textEditorRef.current.addEventListener("mouseenter", handleMouseEnter)
        textEditorRef.current.addEventListener("mouseleave", handleMouseLeave)

        setTextEditorCleanup(() => () => {
          if (textEditorRef.current) {
            textEditorRef.current.removeEventListener(
              "mouseenter",
              handleMouseEnter
            )
            textEditorRef.current.removeEventListener(
              "mouseleave",
              handleMouseLeave
            )
          }
        })
      }
    } else {
      textEditorCleanup?.()
      setTextEditorCleanup(null)
      disableGlobal()
    }
  }

  return (
    <div className="min-h-screen space-y-4 sm:space-y-6 lg:space-y-8">
      <div className="space-y-2 text-center sm:space-y-4">
        <h1 className="text-2xl font-bold sm:text-3xl lg:text-4xl">
          usePreventZoom Hook Demo
        </h1>
        <p className="mx-auto max-w-2xl text-sm text-muted-foreground sm:text-base">
          Zoom is <strong>disabled globally</strong>, but you can enable it for
          specific sections. Hover over enabled sections to zoom normally.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <ZoomOutIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            Global Zoom Control
          </CardTitle>
          <CardDescription className="text-sm">
            Control zoom behavior for the entire website. Test with Ctrl+scroll,
            Ctrl+/-, or pinch gestures.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium sm:text-sm">
                Global Zoom Status:
              </span>
              <Badge
                variant={isGlobalDisabled ? "destructive" : "secondary"}
                className="text-xs"
              >
                {isGlobalDisabled ? "Disabled" : "Enabled"}
              </Badge>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                onClick={disableGlobal}
                disabled={isGlobalDisabled}
                variant="destructive"
                size="sm"
                className="text-xs sm:text-sm"
              >
                <LockIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Disable Globally</span>
                <span className="sm:hidden">Disable</span>
              </Button>
              <Button
                onClick={enableGlobal}
                disabled={!isGlobalDisabled}
                variant="outline"
                size="sm"
                className="text-xs sm:text-sm"
              >
                <UnlockIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Enable Globally</span>
                <span className="sm:hidden">Enable</span>
              </Button>
              <Button
                onClick={toggleGlobal}
                size="sm"
                className="text-xs sm:text-sm"
              >
                Toggle
              </Button>
            </div>
          </div>
          <Separator />
          <div className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-2 sm:gap-4 sm:text-sm">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <MousePointerIcon className="h-3 w-3 text-blue-500 sm:h-4 sm:w-4" />
              <span className="font-medium">Mouse:</span>
              <Badge variant="outline" className="text-xs">
                Ctrl + Scroll
              </Badge>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <KeyboardIcon className="h-3 w-3 text-green-500 sm:h-4 sm:w-4" />
              <span className="font-medium">Keyboard:</span>
              <Badge variant="outline" className="text-xs">
                Ctrl + / -
              </Badge>
            </div>
            <div className="flex items-center gap-1.5 sm:col-span-2 sm:gap-2 lg:col-span-1">
              <SmartphoneIcon className="h-3 w-3 text-purple-500 sm:h-4 sm:w-4" />
              <span className="font-medium">Touch:</span>
              <Badge variant="outline" className="text-xs">
                Pinch Gesture
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        <Card
          ref={modalRef}
          className={cn(
            "transition-all duration-300",
            modalZoomEnabled
              ? "bg-green-50/50 ring-2 ring-green-200 dark:bg-green-950/20"
              : "bg-gray-50/50 ring-2 ring-gray-200 dark:bg-gray-950/20"
          )}
        >
          <CardHeader>
            <CardTitle className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-base sm:text-lg">Modal Section</span>
              <Badge
                variant={modalZoomEnabled ? "default" : "secondary"}
                className="w-fit text-xs"
              >
                {modalZoomEnabled ? "Zoom Enabled" : "Zoom Disabled"}
              </Badge>
            </CardTitle>
            <CardDescription className="text-sm">
              {modalZoomEnabled
                ? "Hover over this section to enable zoom controls. Try zooming while hovering here!"
                : "This section follows the global zoom disabled state."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            <div className="rounded-lg border-2 border-dashed bg-card p-3 sm:p-4">
              <h4 className="mb-2 text-sm font-semibold sm:text-base">
                Modal Content
              </h4>
              <p className="mb-3 text-xs text-muted-foreground sm:text-sm">
                Try zooming here when protection is enabled. Notice how zoom is
                prevented only within this specific area.
              </p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs sm:text-sm"
                >
                  Cancel
                </Button>
                <Button size="sm" className="text-xs sm:text-sm">
                  Confirm
                </Button>
              </div>
            </div>

            <Button
              onClick={toggleModalZoom}
              variant={modalZoomEnabled ? "destructive" : "default"}
              size="sm"
              className="w-full text-xs sm:text-sm"
            >
              {modalZoomEnabled ? (
                <>
                  <LockIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Disable Zoom</span>
                  <span className="sm:hidden">Disable</span>
                </>
              ) : (
                <>
                  <UnlockIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Enable Zoom</span>
                  <span className="sm:hidden">Enable</span>
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card
          ref={galleryRef}
          className={cn(
            "transition-all duration-300",
            galleryZoomEnabled
              ? "bg-green-50/50 ring-2 ring-green-200 dark:bg-green-950/20"
              : "bg-gray-50/50 ring-2 ring-gray-200 dark:bg-gray-950/20"
          )}
        >
          <CardHeader>
            <CardTitle className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-base sm:text-lg">Image Gallery</span>
              <Badge
                variant={galleryZoomEnabled ? "default" : "secondary"}
                className="w-fit text-xs"
              >
                {galleryZoomEnabled ? "Zoom Enabled" : "Zoom Disabled"}
              </Badge>
            </CardTitle>
            <CardDescription className="text-sm">
              {galleryZoomEnabled
                ? "Hover over this gallery to enable zoom. Perfect for examining images!"
                : "Gallery follows global zoom disabled state."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {images.map((i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i.alt}
                  src={i.src}
                  alt={i.alt}
                  width={400}
                  height={400}
                  onContextMenu={(e) => e.preventDefault()}
                  draggable={false}
                  className="aspect-square select-none rounded-lg border"
                />
              ))}
            </div>
            <Button
              onClick={toggleGalleryZoom}
              variant={galleryZoomEnabled ? "destructive" : "default"}
              size="sm"
              className="w-full text-xs sm:text-sm"
            >
              {galleryZoomEnabled ? (
                <>
                  <UnlockIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Enable Zoom</span>
                  <span className="sm:hidden">Enable</span>
                </>
              ) : (
                <>
                  <LockIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Disable Zoom</span>
                  <span className="sm:hidden">Disable</span>
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card
          ref={textEditorRef}
          className={`transition-all duration-300 ${
            textEditorZoomEnabled
              ? "bg-red-50/50 ring-2 ring-red-200 dark:bg-red-950/20"
              : ""
          }`}
        >
          <CardHeader>
            <CardTitle className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-base sm:text-lg">Text Editor</span>
              <Badge
                variant={textEditorZoomEnabled ? "destructive" : "secondary"}
                className="w-fit text-xs"
              >
                {textEditorZoomEnabled ? "Protected" : "Normal"}
              </Badge>
            </CardTitle>
            <CardDescription className="text-sm">
              Text editor where zoom prevention ensures consistent text sizing.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            <textarea
              className="h-20 w-full resize-none rounded-lg border p-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 sm:h-24 sm:p-3 sm:text-sm"
              placeholder="Type your content here... Try zooming when protection is enabled."
              defaultValue="This is a text editor where zoom might interfere with the writing experience. When zoom is disabled for this section, users can focus on content without accidentally changing the view scale."
            />

            <Button
              onClick={toggleTextEditorZoom}
              variant={textEditorZoomEnabled ? "destructive" : "default"}
              size="sm"
              className="w-full text-xs sm:text-sm"
            >
              {textEditorZoomEnabled ? (
                <>
                  <UnlockIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Enable Zoom</span>
                  <span className="sm:hidden">Enable</span>
                </>
              ) : (
                <>
                  <LockIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Disable Zoom</span>
                  <span className="sm:hidden">Disable</span>
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">How to Test</CardTitle>
          <CardDescription className="text-sm">
            Try these interactions to see the zoom prevention in action
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <h4 className="flex items-center gap-2 text-sm font-semibold sm:text-base">
                <MousePointerIcon className="h-3 w-3 text-blue-500 sm:h-4 sm:w-4" />
                Mouse + Keyboard
              </h4>
              <ul className="space-y-1 text-xs text-muted-foreground sm:text-sm">
                <li>• Hold Ctrl + scroll mouse wheel</li>
                <li>• Press Ctrl + Plus (+)</li>
                <li>• Press Ctrl + Minus (-)</li>
                <li>• Press Ctrl + 0</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="flex items-center gap-2 text-sm font-semibold sm:text-base">
                <SmartphoneIcon className="h-3 w-3 text-purple-500 sm:h-4 sm:w-4" />
                Touch Devices
              </h4>
              <ul className="space-y-1 text-xs text-muted-foreground sm:text-sm">
                <li>• Pinch with two fingers</li>
                <li>• Spread fingers apart</li>
                <li>• Double-tap to zoom</li>
              </ul>
            </div>

            <div className="space-y-2 sm:col-span-2 lg:col-span-1">
              <h4 className="flex items-center gap-2 text-sm font-semibold sm:text-base">
                <ZoomInIcon className="h-3 w-3 text-green-500 sm:h-4 sm:w-4" />
                Expected Behavior
              </h4>
              <ul className="space-y-1 text-xs text-muted-foreground sm:text-sm">
                <li>• Global: Affects entire page</li>
                <li>• Section: Only specific areas</li>
                <li>• Visual feedback on protection</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
