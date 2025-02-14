import { useEffect, useState } from 'react';

export type Theme = 'fairytale' | 'space' | 'pirate' | 'other';

type SingleTheme = {
  highlight: string;
  outline: string;
  shadow: string;
  surface: string;
};

type ThemeColors = Record<Theme, SingleTheme>;

// Define your color mappings for each theme
const themeColorMap: ThemeColors = {
  fairytale: {
    highlight: '#FFFFFF',
    outline: '#462911',
    shadow: '#9A4D34',
    surface: '#AF6540',
  },
  space: {
    highlight: '#FFFFFF',
    outline: '#462911',
    shadow: '#9A4D34',
    surface: '#AF6540',
  },
  pirate: {
    highlight: '#FFFFFF',
    outline: '#462911',
    shadow: '#9A4D34',
    surface: '#AF6540',
  },
  other: {
    highlight: '#FFFFFF',
    outline: '#462911',
    shadow: '#9A4D34',
    surface: '#AF6540',
  },
};

export const useSvgTheme = (svgDataUrl: string, theme: Theme) => {
  const [themedImage, setThemedImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    // Decode the data URL
    const decodedSvg = decodeURIComponent(svgDataUrl.split(',')[1]);

    // Parse the SVG string into a DOM document
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(decodedSvg, 'image/svg+xml');
    const svgElement = svgDoc.documentElement;
    const currentThemeColors = themeColorMap[theme];

    if (svgElement) {
      const elementIdsToModify = Object.keys(currentThemeColors).map((id) => `#${id}`);

      // Modify SVG colors based on theme
      const elementsToModify = svgElement.querySelectorAll(elementIdsToModify.join(','));

      elementsToModify.forEach((element) => {
        const newColor = currentThemeColors[element.id as keyof SingleTheme];
        element.setAttribute('fill', newColor);
      });

      // Convert modified SVG back to a data URL
      const serializer = new XMLSerializer();
      const svgStr = serializer.serializeToString(svgElement);
      const svgBlob = new Blob([svgStr], { type: 'image/svg+xml' });
      const svgUrl = URL.createObjectURL(svgBlob);

      // Create and load the image with modified SVG
      const img = new Image();
      img.src = svgUrl;

      img.onload = () => {
        setThemedImage(img);
        URL.revokeObjectURL(svgUrl);
      };
    }
  }, [svgDataUrl, theme]);

  return themedImage;
};
