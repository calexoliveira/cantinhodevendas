interface AnuncioProps {
    texto:string
}
export function Anuncio(props: AnuncioProps) {
    return(
        <div className="flex justify-center items-center h-64 w-64 bg-cyan-500 rounded-full
        text-black font-black text-3xl"
        >{props.texto}</div>
    );
}