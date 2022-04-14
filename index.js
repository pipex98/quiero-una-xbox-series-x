const { chromium } = require('playwright')


const shops = [
    {
        vendor: 'Microsoft',
        url: 'https://www.xbox.com/es-es/configure/8WJ714N3RBTL',
        checkStock: async({page}) => {
            const content = await page.textContent('[aria-label="Finalizar la compra del pack"]')
            return content.includes('Sin existencias') === false
        }
    },
    {
        vendor: 'Amazon',
        url: 'https://www.amazon.es/Microsoft-RRT-00009-Xbox-Series-X/dp/B08H93ZRLL/ref=as_li_ss_tl?__mk_es_ES=%C3%85M%C3%85%C5%BD%C3%95%C3%91&crid=2MRJRZGD1CBJ4&dchild=1&keywords=xbox+series+x&qid=1607550196&sprefix=xbox+s,aps,198&sr=8-1&linkCode=sl1&tag=todoal21-21&linkId=4e08b7956be2cf185b9b23870c56929c&language=es_ES',
        checkStock: async({ page }) => {
            const content = await page.textContent('.a-color-price')
            return content.includes('No disponible') === false
        }
    },
    {
        vendor: 'Exito',
        url: 'https://www.exito.com/consola-xbox-series-x-1tb-microsoft-101154798-mp/p',
        checkStock: async({ page }) => {
            const content = await page.textContent('.exito-product-details-3-x-lastUnitsText')
            return content.includes('No disponible') === false
        }
    }
]

;(async () => {
    const browser = await chromium.launch();

    for (const shop of shops) {
        const { checkStock, vendor, url } = shop

        const page = await browser.newPage()
        await page.goto(url)

        const hasStock = await checkStock({ page })
        console.log(`${vendor}: ${hasStock ? 'HAS STOCK!!!! :)': 'out of stock :(' }`);

        await page.screenshot({ path: `screenshots/${vendor}.png` })

        await page.close();
    }
    

    await browser.close()
})()