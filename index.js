const express = require("express")
const uuid = require("uuid")
const port = 3000
const app = express()

app.use(express.json())

const orders = []

const checkOrderId = (request, response, next) => {
    const { id } = request.params

    const index = orders.findIndex((x) => x.id === id)

    if (index < 0) {
        return response.status(404).json({ message: "Order not found" })
    }

    request.orderIndex = index
    request.orderId = id

    next()
}

const methodUrl = (request, response, next) => {
    const method = request.method
    const url = request.path
    console.log("Method:", "[", method, "]", "-", "URL:", url)

    next()
}

/* LISTA TODOS OS PEDIDOS JÁ FEITO */
app.get("/order", methodUrl, (request, response) => {
    return response.json(orders)
})

/* CADASTRA UM PEDIDO */
app.post("/order", methodUrl, (request, response) => {
    const { order, clientName, price } = request.body;

    const data = {
        id: uuid.v4(),
        order,
        clientName,
        price,
        status: "Em preparação",
    }

    orders.push(data)

    return response.status(201).json(data)
})

/* ALTERA UM PEDIDO JÁ FEITO */
app.put("/order/:id", checkOrderId, methodUrl, (request, response) => {
    const { order, clientName, price, status } = request.body
    const index = request.orderIndex
    const id = request.orderId

    orders[index].id = id
    orders[index].order = order ? order : orders[index].order
    orders[index].clientName = clientName ? clientName : orders[index].clientName
    orders[index].price = price ? price : orders[index].price
    orders[index].status = status ? status : orders[index].status

    return response.json(orders[index])
})

/* DELETA UM PEDIDO JÁ FEITO */
app.delete("/order/:id", checkOrderId, methodUrl, (request, response) => {
    const index = request.orderIndex

    orders.splice(index, 1)

    return response.status(204).json(true)
})

/* LISTA UM PEDIDO ESPECÍFICO */
app.get("/order/:id", checkOrderId, methodUrl, (request, response) => {
    const index = request.orderIndex
    return response.json(orders[index])
})

/* ATUALIZAR STATUS DE UM PEDIDO ESPECÍFICO */
app.patch("/order/:id", checkOrderId, (request, response) => {
    const index = request.orderIndex
    orders[index].status = "Pronto"
    return response.json(orders[index])
})

app.listen(port, () => {
    console.log("SERVER STARTED ON PORT ${port}")
})