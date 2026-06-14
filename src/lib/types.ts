export type ThemeMode = 'light' | 'dark' | 'auto';
export type AccentStyle = 'grayscale' | 'custom';
export type IconColorMode = 'light' | 'dark' | 'auto' | 'theme' | 'custom';
export type IconFontFamily = 1 | 2 | 3 | 4 | 5;

export interface ExtensionSettings {
    seedColor: string;           // Hex code for Custom Accent theme, e.g., "#6750A4"
    themeMode: ThemeMode;        // Light, Dark, Auto (follows system popup UI theme)
    accentStyle: AccentStyle;    // Grayscale, Custom Accent Theme
    iconColorMode: IconColorMode;// Light, Dark, Auto, Theme (uses seedColor), Custom (iconCustomColor)
    iconCustomColor: string;     // Hex code for Custom Icon background
    iconFont: IconFontFamily;    // Selected icon font (1, 2, 3, 4, or 5)
    copyFormat: string;          // Format for copy-to-clipboard, default "Week %"
}
