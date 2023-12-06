export type Docs = {
  name: string,
  pdf: string,
  data: string,
  json?: any,
  total: number,
  totalKey: string
}
export type ChevalierBatch = {
  id: string,
  name: string,
  docs: Docs[]
  total: number
}
export const getChevalierBatch = async (id:string):ChevalierBatch => {
  const _batch = {...allBatch.find(b => b.id === id) as ChevalierBatch};
  for await (const doc of _batch.docs) {
    doc.json = await (await fetch(doc.data)).json();
    console.log(doc.json)
    doc.total = doc.json.analyzeResult.documents[0].fields[doc.totalKey].valueNumber

  }
  return  _batch as ChevalierBatch
}

const allBatch:ChevalierBatch[] = [
  {
    id:"ETS",
    name: "ETS",
    docs: [
      {
        name: "AHPFC3A0032-invoice 1",
        pdf: '/chevalier/ETS/AHPFC3A0032/AHPFC3A0032-invoice 1.pdf',
        data: '/chevalier/ETS/AHPFC3A0032/AHPFC3A0032-invoice 1.pdf.json',
        total: 0,
        totalKey: 'invoice total'
      }
    ],
    total: 0
  },
  {
    id:"GNT",
    name: "GNT",
    docs: [
      {
        name: "AHPFC3A0032-invoice 1",
        pdf: '/chevalier/GNT/AHPFC3A0018/AHPFC3A0018 -Invoice 1.pdf',
        data: '/chevalier/GNT/AHPFC3A0018/AHPFC3A0018 -Invoice 1.pdf.json',
        total: 0,
        totalKey: 'invoice total'
      },
      {
        name: "AHPFC3A0032-invoice 2",
        pdf: '/chevalier/GNT/AHPFC3A0018/AHPFC3A0018 -Invoice 2.pdf',
        data: '/chevalier/GNT/AHPFC3A0018/AHPFC3A0018 -Invoice 2.pdf.json',
        total: 0,
        totalKey: 'invoice total'
      },
      {
        name: "AHPFC3A0032-invoice 3",
        pdf: '/chevalier/GNT/AHPFC3A0018/AHPFC3A0018 -Invoice 3.pdf',
        data: '/chevalier/GNT/AHPFC3A0018/AHPFC3A0018 -Invoice 3.pdf.json',
        total: 0,
        totalKey: 'invoice total',
      },
      {
        name: "AHPFC3A0032-invoice 4",
        pdf: '/chevalier/GNT/AHPFC3A0018/AHPFC3A0018 -Invoice 4.pdf',
        data: '/chevalier/GNT/AHPFC3A0018/AHPFC3A0018 -Invoice 4.pdf.json',
        total: 0,
        totalKey: 'invoice total',
      },
      {
        name: "PRF",
        pdf: '/chevalier/GNT/AHPFC3A0018/PRF.pdf',
        data: '/chevalier/GNT/AHPFC3A0018/PRF.pdf.json',
        total: 0,
        totalKey: 'Total',
      }
    ],
    total: 0
  },
  {
    id: 'Xinyi',
    name: 'Xinyi',
    docs: [
      {
        name: "Invoice 1",
        pdf: '/chevalier/Xinyi/AHPFC3A0018/Invoice 1.pdf',
        data: '/chevalier/Xinyi/AHPFC3A0018/Invoice 1.pdf.json',
        total: 0,
        totalKey: 'invoice total'
      },
      {
        name: "PRF",
        pdf: '/chevalier/Xinyi/AHPFC3A0018/PRF.pdf',
        data: '/chevalier/Xinyi/AHPFC3A0018/PRF.pdf.json',
        total: 0,
        totalKey: 'invoice total'
      }
    ],
    total: 0
  }
]
