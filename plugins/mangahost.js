module.exports = {
    source: 'Manga Host',
    icon: 'https://mangahost4.com/wp-content/themes/mangahost/img/favicon.png',
    run: (modules) => {
        const request = modules.web({ cloudflare: true })

        return {
            chapter: (chapter, callback) => {
                let pages = []
                request(chapter, (err, response, body) => {
                    modules.parse(body).querySelectorAll('#slider > a > picture > img').forEach(r => pages.push(r.getAttribute('src')))
                    callback(pages)
                })
            },
    
            item: (id, callback) => {
                request(id, (err, response, body) => {
                    let doc = modules.parse(body)
                    let chapters = []
                    let synopsis = ''
                    doc.querySelectorAll('.paragraph > p').forEach(r => synopsis = synopsis + r.textContent)
                    doc.querySelectorAll('.chapters > div > a').forEach(r => {
                        chapters.push({
                            ch: r.textContent,
                            id: id+'/'+r.textContent
                        })
                    })
                    callback({
                        poster: doc.querySelector('.widget > picture > img').getAttribute('src'),
                        name: doc.querySelector('.w-col.w-col-7 > article > h1').textContent,
                        synopsis: synopsis,
                        chapters: chapters
                    })
                })
            },
    
            search: (search, callback) => {
                request('https://mangahosted.com/find/'+String(search).toLowerCase().replace(/\s+/g, "+"), (err, response, body) => {
                    modules.parse(body).querySelectorAll('body > div.w-container > main > table > tbody > tr').forEach(item => {
                        callback({
                            name: item.querySelector('td:nth-child(2) > h4 > a').textContent,
                            synopsis: item.querySelector('td:nth-child(2) > div').textContent,
                            poster: item.querySelector('td:nth-child(1) > a > picture > img').getAttribute('src'),
                            id: item.querySelector('td:nth-child(1) > a').getAttribute('href')
                        })
                    })
                })
            }
        }
    }
}
