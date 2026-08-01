import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';

/**
 * Download a DOM element as PNG image with high DPI and zero text distortion
 */
export const downloadElementAsPNG = async (elementId: string, filename: string = 'Employee_ID_Card.png') => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element #${elementId} not found`);
    return;
  }

  try {
    const image = await toPng(element, {
      quality: 1.0,
      pixelRatio: 3, // High DPI resolution (300 DPI)
      backgroundColor: '#ffffff',
      cacheBust: true,
      style: {
        transform: 'none',
        margin: '0',
      }
    });

    const link = document.createElement('a');
    link.href = image;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('PNG export failed:', error);
  }
};

/**
 * Download a single ID card or front+back as PDF (CR80 standard credit card size ~85.6mm x 54mm)
 */
export const downloadCardAsPDF = async (frontId: string, backId?: string, filename: string = 'Employee_ID_Card.pdf') => {
  const frontEl = document.getElementById(frontId);
  if (!frontEl) {
    console.error(`Front Element #${frontId} not found`);
    return;
  }

  try {
    // Standard CR80 ID Card dimensions in mm (Landscape orientation)
    const cardWidth = 85.6;
    const cardHeight = 54.0;

    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [cardWidth, cardHeight],
    });

    // Render Front
    const imgFront = await toPng(frontEl, {
      quality: 1.0,
      pixelRatio: 3,
      backgroundColor: '#ffffff',
      cacheBust: true,
    });
    pdf.addImage(imgFront, 'PNG', 0, 0, cardWidth, cardHeight);

    // If back element exists, add page 2
    if (backId) {
      const backEl = document.getElementById(backId);
      if (backEl) {
        const imgBack = await toPng(backEl, {
          quality: 1.0,
          pixelRatio: 3,
          backgroundColor: '#ffffff',
          cacheBust: true,
        });
        pdf.addPage([cardWidth, cardHeight], 'landscape');
        pdf.addImage(imgBack, 'PNG', 0, 0, cardWidth, cardHeight);
      }
    }

    pdf.save(filename);
  } catch (error) {
    console.error('PDF export failed:', error);
  }
};

/**
 * Trigger window printing for elements wrapped in printable view
 */
export const triggerPrint = () => {
  window.print();
};

/**
 * Generate a data URL from a direct DOM HTMLElement reference
 */
export const generateImageFromElement = async (element: HTMLElement, options: { scale?: number } = {}): Promise<string> => {
  return await toPng(element, {
    quality: 1.0,
    pixelRatio: options.scale || 3,
    backgroundColor: '#ffffff',
    cacheBust: true,
  });
};

/**
 * Generate a multi-page PVC PDF from an array of HTMLElement references (for front/back duplex printing)
 */
export const generatePDFFromElements = async (
  elements: HTMLElement[],
  filename: string = 'DevTech_Badge.pdf',
  options: { orientation?: 'portrait' | 'landscape' } = { orientation: 'landscape' }
): Promise<void> => {
  const isLandscape = options.orientation === 'landscape';
  const width = isLandscape ? 85.6 : 54.0;
  const height = isLandscape ? 54.0 : 85.6;

  const pdf = new jsPDF({
    orientation: isLandscape ? 'landscape' : 'portrait',
    unit: 'mm',
    format: [width, height],
  });

  for (let i = 0; i < elements.length; i++) {
    const el = elements[i];
    if (!el) continue;

    const imgData = await toPng(el, {
      quality: 1.0,
      pixelRatio: 3,
      backgroundColor: '#ffffff',
      cacheBust: true,
    });

    if (i > 0) {
      pdf.addPage([width, height], isLandscape ? 'landscape' : 'portrait');
    }
    pdf.addImage(imgData, 'PNG', 0, 0, width, height);
  }

  pdf.save(filename);
};
