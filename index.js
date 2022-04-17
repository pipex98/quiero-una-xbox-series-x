const { chromium } = require('playwright')


const shops = [
    {
        vendor: 'Microsoft',
        hasSchema: false,
        url: 'https://www.xbox.com/es-es/configure/8WJ714N3RBTL',
        checkStock: async({page}) => {
            const content = await page.textContent('[aria-label="Finalizar la compra del pack"]')
            return content.includes('Sin existencias') === false
        }
    },
    {
        vendor: 'Amazon',
        hasSchema: false,
        url: 'https://www.amazon.es/Far-Cry-Limited-Exclusiva-Amazon/dp/B08CHMHM9C/ref=sr_1_1?keywords=far%2Bcry%2B6%2Bps4&qid=1650122438&sprefix=far%2Bc%2Caps%2C255&sr=8-1&th=1',
        checkStock: async({ page }) => {
            const addToCartButton = await page.$$('#add-to-cart-button')
            return addToCartButton.length > 0
        }
    },
    {
        vendor: 'Exito',
        hasSchema: false,
        url: 'https://www.exito.com/consola-xbox-series-x-1tb-microsoft-101154798-mp/p',
        checkStock: async({ page }) => {
            const content = await page.textContent('.exito-product-details-3-x-lastUnitsText')
            return content.includes('No disponible') === false
        }
    },
    // {
    //     vendor: 'Fnac',
    //     hasSchema: true,
    //     url: 'https://www.fnac.es/Consola-Xbox-Series-S-512GB-Blanco-Videoconsola-Consola/a7732210',
    //     checkStock: async({page}) => {
    //         const notAvailableIcon = await page.$$('.f-buyBox-availabilityStatus-unavailable') //estamos evaluando si existe el icono, devuelve un array
    //         return notAvailableIcon.length === 0
    //     }
    // },
//     disabled for now because it's not working property
//     {
//         vendor: 'Mediamarkt',
//         hasSchema: true
//         url: 'https://www.mediamarkt.es/es/product/_consola-microsoft-xbox-series-x-1-tb-ssd-negro-1487615.html',
//         checkStock: async({ page }) => {
//             const content = await page.textContent('.BaseTypo-sc-1jga2g7-0.izkVco.StyledInfoTypo-sc-1jga2g7-1.ecJNXP')
//             return content.includes('No está disponible') === false
//         }
//     }
    // {
    //     vendor: 'El Corte Inglés',
    //     hasSchema: false,
    //     url: 'https://www.elcorteingles.es/videojuegos/A37047080-xbox-series-s/?color=Blanco',
    //     checkStock: async({ page }) => {
    //         const content = await page.textContent('.js_add_to_cart_desktop')
    //         return content.includes('Agotado temporalmente') === false
    //     }
    // }
 ]

;(async () => {
    const browser = await chromium.launch({ headless: false });

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