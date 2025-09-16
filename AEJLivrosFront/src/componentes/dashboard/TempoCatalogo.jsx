import React from "react";
import "./TempoCatalogo.css";

const livros = [
  {
    id: 1,
    titulo: "Livro 1",
    dias: 142,
    capa: "https://imgs.search.brave.com/mhHwaNyPo3ISCM6Ux78o8U-zsua8CP4ZNc37jKZFwGQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9raWth/Y2FzdHJvLmNvbS5i/ci93cC1jb250ZW50/L3VwbG9hZHMvMjAy/Mi8wOS92ZXNwZXJh/X2xpdnJvX2Nhcmxh/X21hZGVpcmEuanBn/P3c9NzUw", // substitua pelo link da capa
  },
  {
    id: 2,
    titulo: "Livro 2",
    dias: 72,
    capa: "https://imgs.search.brave.com/CP1n5y37d1HTtCPT14NBU489cSCpgikrhlFGTl9qSBM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMuZGxpdnJvcy5v/cmcvRnJlaWRhLU1j/RmFkZGVuL2VtcHJl/Z2FkYS1mcmVpZGEt/bWNmYWRkZW5fbGFy/Z2Uud2VicA",
  },
  {
    id: 3,
    titulo: "Livro 3",
    dias: 54,
    capa: "https://imgs.search.brave.com/jlYugXLnVGsqVseqpPvyhmzIcSsIH5sunu7lE7hHnzY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/cHJlc2VuY2EucHQv/Y2RuL3Nob3AvcHJv/ZHVjdHMvaW1hZ2Ut/MV84ZjAyNWNhNy03/NmYyLTQxNDctYmM2/OS1hZjc2M2EzZTRi/MThfMTAyNHgxMDI0/LmpwZz92PTE2MDQ3/NzU2ODc",
  },
  {
    id: 4,
    titulo: "Livro 4",
    dias: 36,
    capa: "https://imgs.search.brave.com/gyQIEeIC-MEMpZevaHa8kXIMFqDPu56oqjBCefWr5P8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzLzM0L2I3/LzkzLzM0Yjc5MzEw/MWQxMzY3YWZhNzBi/ZTI1YmM2ZDA3MTBm/LmpwZw",
  },
  {
    id: 5,
    titulo: "Livro 5",
    dias: 21,
    capa: "https://imgs.search.brave.com/XLWjMHIQJ0pyhSH7eTtU1TJvA7CTFv2P2wvBkc-2AFY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbmZp/bml0YXN2aWRhcy53/b3JkcHJlc3MuY29t/L3dwLWNvbnRlbnQv/dXBsb2Fkcy8yMDIy/LzAxL21hbGlidS1y/ZW5hc2NlLnBuZz93/PTY0MA",
  },
  {
    id: 6,
    titulo: "Livro 6",
    dias: 8,
    capa: "https://imgs.search.brave.com/7uDsy1IvS0jVE0bqAxlq2RUetX9GG42cj-ZQVE8-0jk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9odHRw/Mi5tbHN0YXRpYy5j/b20vRF9OUV9OUF83/MzgyMTAtTUxCNDk1/MjQ4NTYxMjZfMDMy/MDIyLU8ud2VicA",
  },
];

function TempoCatalogo() {
  return (
    <div className="tempo-catalogo">
      <h3>Tempo de permanência no catálogo</h3>
      <div className="livros-grid">
        {livros.map((livro) => (
          <div key={livro.id} className="livro-item">
            <div className="livro-numero">{livro.id}.</div>
            <img src={livro.capa} alt={livro.titulo} className="livro-capa-mini" />
            <div className="livro-info">
              <span className="label">Tempo de permanência:</span>
              <p className="dias">{livro.dias} dias</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TempoCatalogo;
