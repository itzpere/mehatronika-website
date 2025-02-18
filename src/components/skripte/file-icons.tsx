import {
  FileIcon,
  FileTextIcon,
  ImageIcon,
  FileCodeIcon,
  FilePenLineIcon,
  Table2Icon,
  ShapesIcon,
  BrainCircuitIcon,
  DatabaseIcon,
  CogIcon,
  CircuitBoardIcon,
  WrenchIcon,
  LayersIcon,
  BoxIcon,
  ShipIcon,
} from 'lucide-react'

export const getFileIcon = (filename: string) => {
  const ext = filename.split('.').pop()?.toLowerCase()

  switch (ext) {
    case 'pdf':
      return <FileTextIcon className="w-5 h-5 mr-2 text-red-500" />
    case 'doc':
    case 'docx':
      return <FileTextIcon className="w-5 h-5 mr-2 text-blue-500" />
    case 'xls':
    case 'xlsx':
    case 'csv':
      return <Table2Icon className="w-5 h-5 mr-2 text-green-500" />
    case 'ppt':
    case 'pptx':
      return <FileTextIcon className="w-5 h-5 mr-2 text-orange-500" />
    case 'odt':
    case 'rtf':
      return <FilePenLineIcon className="w-5 h-5 mr-2 text-blue-400" />
    case 'ods':
      return <Table2Icon className="w-5 h-5 mr-2 text-green-400" />
    case 'py':
    case 'ipynb':
      return <FileCodeIcon className="w-5 h-5 mr-2 text-yellow-500" />
    case 'js':
    case 'jsx':
    case 'ts':
    case 'tsx':
      return <FileCodeIcon className="w-5 h-5 mr-2 text-blue-400" />
    case 'html':
    case 'htm':
      return <FileCodeIcon className="w-5 h-5 mr-2 text-orange-500" />
    case 'css':
    case 'scss':
    case 'sass':
      return <FileCodeIcon className="w-5 h-5 mr-2 text-pink-500" />
    case 'json':
    case 'yaml':
    case 'yml':
      return <FileCodeIcon className="w-5 h-5 mr-2 text-green-400" />
    case 'sql':
    case 'db':
    case 'sqlite':
      return <DatabaseIcon className="w-5 h-5 mr-2 text-blue-500" />
    case 'r':
    case 'mat':
    case 'mlx':
      return <BrainCircuitIcon className="w-5 h-5 mr-2 text-violet-400" />
    case 'c':
    case 'cpp':
    case 'h':
    case 'hpp':
      return <FileCodeIcon className="w-5 h-5 mr-2 text-blue-600" />
    case 'java':
    case 'class':
    case 'jar':
      return <FileCodeIcon className="w-5 h-5 mr-2 text-red-400" />
    case 'stl':
    case 'obj':
    case '3mf':
    case 'fbx':
      return <ShapesIcon className="w-5 h-5 mr-2 text-violet-500" />
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'webp':
      return <ImageIcon className="w-5 h-5 mr-2 text-purple-500" />
    case 'step':
    case 'stp':
    case 'iges':
    case 'igs':
      return <LayersIcon className="w-5 h-5 mr-2 text-blue-500" />
    case 'sldprt':
    case 'sldasm':
    case 'slddrw':
      return <BoxIcon className="w-5 h-5 mr-2 text-red-500" /> // SolidWorks
    case 'prt':
    case 'asm':
    case 'drw':
      return <BoxIcon className="w-5 h-5 mr-2 text-orange-500" /> // Creo/ProE
    case 'nc':
    case 'gcode':
    case 'mpf':
      return <CogIcon className="w-5 h-5 mr-2 text-green-600" />
    case 'ino':
    case 'hex':
      return <ShipIcon className="w-5 h-5 mr-2 text-cyan-500" />
    case 'pcb':
    case 'sch':
    case 'brd':
      return <CircuitBoardIcon className="w-5 h-5 mr-2 text-emerald-500" />
    case 'slx':
    case 'mdl':
    case 'sim':
      return <WrenchIcon className="w-5 h-5 mr-2 text-amber-500" />
    default:
      return <FileIcon className="w-5 h-5 mr-2 text-muted-foreground" />
  }
}
