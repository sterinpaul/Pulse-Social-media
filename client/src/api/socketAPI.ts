const token = localStorage.getItem('token')
console.log(token)

const headers = {
    headers:{
        Authorization: `Bearer ${token}`
    }
}

export default headers