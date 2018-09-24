
    // onContentKeyDownHandler = event => {
    //     if (event.keyCode === 9) {
    //         event.preventDefault()
    //         let start = event.target.selectionStart
    //         let end = event.target.selectionEnd
    //         let val = event.target.value
    //         let selected = val.substring(start, end)
    //         let re, count
    //         let happened = false

    //         if (event.shiftKey) {
    //             re = /^\t/gm
    //             if (selected.length > 0) {
    //                 count = -selected.match(re).length
    //                 event.target.value =
    //                     val.substring(0, start) +
    //                     selected.replace(re, "") +
    //                     val.substring(end)
    //             } else {
    //                 const before = val.substring(start - 1, start)
    //                 if (before === "\t") {
    //                     event.target.value =
    //                         val.substring(0, start - 1) + val.substring(start)
    //                     happened = true
    //                 }
    //             }
    //             // todo: add support for shift-tabbing without a selection
    //         } else {
    //             re = /^/gm
    //             count = selected.match(re).length
    //             event.target.value =
    //                 val.substring(0, start) +
    //                 selected.replace(re, "\t") +
    //                 val.substring(end)
    //         }

    //         if (start === end) {
    //             event.target.selectionStart = end + count
    //         } else {
    //             event.target.selectionStart = start
    //         }
    //         if (happened) {
    //             event.target.selectionStart = start
    //         }

    //         event.target.selectionEnd = end + count
    //         this.content = event.target.value
    //         this.checkSaveTimer()
    //     }
    // }