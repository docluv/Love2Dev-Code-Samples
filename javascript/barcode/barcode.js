function fetchImage() {

    fetch( "javascript/barcode/example-barcode.png" )
        .then( response => {
            if ( !response.ok ) {
                throw new Error( 'Network response was not ok' );
            }
            return response.blob();
        } )
        .then( img => {

            return parseBarCode( img );

        } )
        .catch( error => {
            console.error( 'There has been a problem with your fetch operation:', error );
        } );
}

function addBarCode( barcode ) {

    let $output = document.querySelector( ".barcode-value" );

    $output.innerHTML = barcode + "<br/>";

}

function parseBarCode( src ) {

    let img = document.querySelector( ".src-img" );

    //    img.src = URL.createObjectURL( src );

    const barcodeDetector = new BarcodeDetector( {
        // (Optional) A series of barcode formats to search for.
        // Not all formats may be supported on all platforms
        formats: [
            'aztec',
            'code_128',
            'code_39',
            'code_93',
            'codabar',
            'data_matrix',
            'ean_13',
            'ean_8',
            'itf',
            'pdf417',
            'qr_code',
            'upc_a',
            'upc_e'
        ]
    } );

    return barcodeDetector.detect( img )
        .then( barcodes => {

            barcodes.forEach( barcode => addBarCode( barcode ) );

        } )
        .catch( e => {
            console.error( 'Barcode detection failed:', e );
        } );

}

//fetchImage();
parseBarCode();