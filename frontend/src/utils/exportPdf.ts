import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export async function exportElementToPdf(
    element: HTMLElement,
    fileName: string,
) {

    const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
    });

    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const margin = 10;
    const usableWidth = pageWidth - margin * 2;
    const usableHeight = pageHeight - margin * 2 - 6; // 6mm para el pie de página

    // Cuántos píxeles del canvas equivalen a 1 mm en el PDF
    const pxPerMm = canvas.width / usableWidth;
    const pageHeightPx = Math.floor(usableHeight * pxPerMm);

    let renderedPx = 0;
    let pageIndex = 0;

    while (renderedPx < canvas.height) {

        const sliceHeightPx = Math.min(
            pageHeightPx,
            canvas.height - renderedPx,
        );

        const pageCanvas = document.createElement("canvas");
        pageCanvas.width = canvas.width;
        pageCanvas.height = sliceHeightPx;

        const ctx = pageCanvas.getContext("2d");

        if (!ctx) {
            throw new Error("No se pudo generar el PDF");
        }

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);

        ctx.drawImage(
            canvas,
            0, renderedPx, canvas.width, sliceHeightPx,
            0, 0, canvas.width, sliceHeightPx,
        );

        if (pageIndex > 0) {
            pdf.addPage();
        }

        pdf.addImage(
            pageCanvas.toDataURL("image/png"),
            "PNG",
            margin,
            margin,
            usableWidth,
            sliceHeightPx / pxPerMm,
        );

        renderedPx += sliceHeightPx;
        pageIndex++;
    }

    // Pie de página: "Página X de Y"
    const totalPages = pdf.getNumberOfPages();

    pdf.setFontSize(8);

    for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.text(
            `Página ${i} de ${totalPages}`,
            pageWidth / 2,
            pageHeight - 5,
            { align: "center" },
        );
    }

    pdf.save(fileName.endsWith(".pdf") ? fileName : `${fileName}.pdf`);
}