import React from 'react'

const S = ({ size = 24, fill = 'none', stroke = 'currentColor', sw = 2, children, vb = '0 0 24 24', ...rest }) => (
  <svg aria-label="icon" width={size} height={size} viewBox={vb} fill={fill} stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" {...rest}>
    {children}
  </svg>
)

export const IcHome = (p) => <S {...p}><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h5v-6h4v6h5V9.5" /></S>
export const IcHomeFill = (p) => <S {...p} fill="currentColor" stroke="none"><path d="M22 11.2 12 3 2 11.2V21h7v-6h6v6h7z" /></S>
export const IcSearch = (p) => <S {...p} sw={2.2}><circle cx="10.8" cy="10.8" r="7.3" /><path d="m21 21-4.8-4.8" /></S>
export const IcCompass = (p) => <S {...p}><circle cx="12" cy="12" r="9.2" /><path d="m15.5 8.5-2 5-5 2 2-5z" /></S>
export const IcCompassFill = (p) => <S {...p}><circle cx="12" cy="12" r="10" fill="currentColor" stroke="none" /><path d="m16.2 7.8-2.4 6-6 2.4 2.4-6z" fill="#fff" stroke="none" /></S>
export const IcReels = (p) => <S {...p}><rect x="2.5" y="2.5" width="19" height="19" rx="4.5" /><path d="M2.8 8h18.4M8.6 2.6 11.5 8M15.4 2.6 18.3 8" /><path d="m10.2 12.2 4.6 2.6-4.6 2.6z" fill="currentColor" stroke="none" /></S>
export const IcReelsFill = (p) => <S {...p} fill="currentColor" stroke="currentColor" strokeWidth={0}><rect x="2.5" y="2.5" width="19" height="19" rx="4.5" /><path d="M2.8 8h18.4M8.6 2.6 11.5 8M15.4 2.6 18.3 8" stroke="#fff" /><path d="m10.2 12.2 4.6 2.6-4.6 2.6z" fill="#fff" /></S>
export const IcHeart = (p) => <S {...p}><path d="M12 20.7C7.8 17.8 2.6 13.9 2.6 9.3c0-2.8 2-5 4.7-5 1.9 0 3.6 1 4.7 2.7 1.1-1.7 2.8-2.7 4.7-2.7 2.7 0 4.7 2.2 4.7 5 0 4.6-5.2 8.5-9.4 11.4z" /></S>
export const IcHeartFill = (p) => <S {...p} fill="currentColor" stroke="none"><path d="M12 20.7C7.8 17.8 2.6 13.9 2.6 9.3c0-2.8 2-5 4.7-5 1.9 0 3.6 1 4.7 2.7 1.1-1.7 2.8-2.7 4.7-2.7 2.7 0 4.7 2.2 4.7 5 0 4.6-5.2 8.5-9.4 11.4z" /></S>
export const IcComment = (p) => <S {...p}><path d="M20.7 11.6a8.7 8.7 0 0 1-12.5 7.9L3.4 20.6l1.1-4.7a8.7 8.7 0 1 1 16.2-4.3z" /></S>
export const IcSend = (p) => <S {...p}><path d="M21.5 2.5 2.8 9.8l7.2 3.2 3.2 7.2z" /><path d="M21.5 2.5 10 13" /></S>
export const IcBookmark = (p) => <S {...p}><path d="M18.5 21 12 16.4 5.5 21V3.5h13z" /></S>
export const IcBookmarkFill = (p) => <S {...p} fill="currentColor"><path d="M18.5 21 12 16.4 5.5 21V3.5h13z" /></S>
export const IcPlusSquare = (p) => <S {...p}><rect x="3" y="3" width="18" height="18" rx="4.5" /><path d="M12 8v8M8 12h8" /></S>
export const IcDots = (p) => <S {...p} fill="currentColor" stroke="none"><circle cx="5" cy="12" r="1.7" /><circle cx="12" cy="12" r="1.7" /><circle cx="19" cy="12" r="1.7" /></S>
export const IcX = (p) => <S {...p} sw={2.4}><path d="M5 5l14 14M19 5 5 19" /></S>
export const IcChevronL = (p) => <S {...p}><path d="m15 5-7 7 7 7" /></S>
export const IcChevronR = (p) => <S {...p}><path d="m9 5 7 7-7 7" /></S>
export const IcChevronD = (p) => <S {...p}><path d="m5 9 7 7 7-7" /></S>
export const IcGrid = (p) => <S {...p}><rect x="3" y="3" width="18" height="18" rx="1.5" /><path d="M9 3v18M15 3v18M3 9h18M3 15h18" /></S>
export const IcMenu = (p) => <S {...p}><path d="M3.5 6h17M3.5 12h17M3.5 18h17" /></S>
export const IcSettings = (p) => <S {...p}><circle cx="12" cy="12" r="3.2" /><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.55V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1.11-1.55 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.55-1H3a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 1.55-1.11 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34h.09a1.7 1.7 0 0 0 1-1.55V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87v.09a1.7 1.7 0 0 0 1.55 1H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.51 1z" /></S>
export const IcLogout = (p) => <S {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="m16 17 5-5-5-5" /><path d="M21 12H9" /></S>
export const IcTrash = (p) => <S {...p}><path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6M14 11v6" /></S>
export const IcCamera = (p) => <S {...p}><path d="M3 8a2.5 2.5 0 0 1 2.5-2.5h1.6l1.4-2h7l1.4 2h1.6A2.5 2.5 0 0 1 21 8v10a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 18z" /><circle cx="12" cy="12.5" r="3.7" /></S>
export const IcPlay = (p) => <S {...p} fill="currentColor" stroke="none"><path d="M7 4.5 19.5 12 7 19.5z" /></S>
export const IcSmile = (p) => <S {...p}><circle cx="12" cy="12" r="9.2" /><path d="M8.2 14a4.8 4.8 0 0 0 7.6 0" /><path d="M9 9.5h.01M15 9.5h.01" strokeWidth={2.8} /></S>
export const IcMute = (p) => <S {...p}><path d="M11 5 6.5 8.5H3v7h3.5L11 19z" /><path d="m15.5 9.5 5 5M20.5 9.5l-5 5" /></S>
export const IcSound = (p) => <S {...p}><path d="M11 5 6.5 8.5H3v7h3.5L11 19z" /><path d="M15 8.6a5 5 0 0 1 0 6.8M17.8 6a9 9 0 0 1 0 12" /></S>
export const IcNewMsg = (p) => <S {...p}><path d="M21.5 11.5v7a2.5 2.5 0 0 1-2.5 2.5H5a2.5 2.5 0 0 1-2.5-2.5v-13A2.5 2.5 0 0 1 5 3h8" /><path d="M19.5 3.5v6M16.5 6.5h6" /></S>
export const IcVerified = (p) => <S {...p} fill="#0095f6" stroke="none"><path d="M12 1.5 14.8 4l3.7-.4 1 3.6 3.2 2-1.6 3.3 1.6 3.3-3.2 2-1 3.6-3.7-.4L12 23l-2.8-2.5-3.7.4-1-3.6-3.2-2L2.9 12 1.3 8.7l3.2-2 1-3.6L9.2 4z" /><path d="m8.3 12.3 2.4 2.4 5-5" stroke="#fff" strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" /></S>
export const IcImage = (p) => <S {...p}><rect x="3" y="3" width="18" height="18" rx="3" /><circle cx="9" cy="9" r="2" /><path d="m4 19 6.5-6.5 3 3L17 12l4 4.5" /></S>
export const IcVideo = (p) => <S {...p}><rect x="2.5" y="5" width="14" height="14" rx="3" /><path d="m16.5 10.5 5-3v9l-5-3" /></S>
export const IcBack = (p) => <S {...p}><path d="M19 12H5" /><path d="m11 6-6 6 6 6" /></S>
