const express = require('express')
const router = express.Router()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const cors = require('cors');
router.use(cors());

router.get("/test", async (req, res) => {
    res.send("test!")
})

router.post("/", async (req, res) => {
    const {} = req.body;
    res.json(cards)
})