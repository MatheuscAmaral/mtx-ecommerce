import img from "../../assets/undraw_taken_re_yn20.svg"

const NotFound = () => {
    return (
        <div className="my-36 flex justify-center items-center gap-20">
            <h1 className="text-6xl text-gray-700 font-semibold">404 Página não encontrada</h1>
            <img className="w-96" src={img} alt="404" />
        </div>
    )
}


export default NotFound;
