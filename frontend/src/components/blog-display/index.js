import './index.css'
const DisplayBlog=(cont)=>{
    //console.log(cont.cont.id)
    cont=cont.cont
    return(
        <div className="blog-card border">
            <h2>{cont.title}</h2>
            <p>{cont.content}</p>
            <h6>{cont.created_at}</h6>
        </div>
    )
}
export default DisplayBlog