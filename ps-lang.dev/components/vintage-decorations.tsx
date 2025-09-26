export function InkStain({ type = "red", className = "" }: { type?: "red" | "blue"; className?: string }) {
  return (
    <div
      className={`absolute pointer-events-none opacity-20 ${className}`}
      style={{
        width: "60px",
        height: "60px",
        background:
          type === "red"
            ? "radial-gradient(ellipse at center, #c44536 0%, rgba(196, 69, 54, 0.3) 40%, transparent 70%)"
            : "radial-gradient(ellipse at center, #2d5aa0 0%, rgba(45, 90, 160, 0.3) 40%, transparent 70%)",
        borderRadius: "50%",
        filter: "blur(1px)",
        transform: `rotate(${Math.random() * 360}deg) scale(${0.8 + Math.random() * 0.4})`,
      }}
    />
  )
}

export function PaperClip({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute pointer-events-none ${className}`}>
      <div
        className="w-6 h-12 border-2 border-gray-400 rounded-t-lg"
        style={{
          borderBottomColor: "transparent",
          transform: "rotate(15deg)",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      />
    </div>
  )
}

export function VintageCorner({
  position = "top-left",
  className = "",
}: {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right"
  className?: string
}) {
  const positionClasses = {
    "top-left": "top-0 left-0",
    "top-right": "top-0 right-0 rotate-90",
    "bottom-left": "bottom-0 left-0 -rotate-90",
    "bottom-right": "bottom-0 right-0 rotate-180",
  }

  return (
    <div className={`absolute w-8 h-8 pointer-events-none ${positionClasses[position]} ${className}`}>
      <div
        className="w-full h-full opacity-30"
        style={{
          background: "linear-gradient(45deg, rgba(44, 36, 22, 0.1) 0%, transparent 50%)",
          clipPath: "polygon(0 0, 100% 0, 0 100%)",
        }}
      />
    </div>
  )
}
