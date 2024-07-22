export default function FancyText({ title = false, text }: { title: boolean, text: string }) {
    return title
        ? <h1 className='fancy title'>{text}</h1>
        : <h3 className='fancy cursive'>{text}</h3>
}
