<?php
/**
 * Created by IntelliJ IDEA.
 * User: shuimnh_double
 * Date: 14-11-4
 * Time: 10:07
 */


sleep(3);

$callbackFn = $_REQUEST['callback'];

echo( $callbackFn.'({
    iStatus: 1,
    aData:{
        iNoReadCount: 10
    }})'
);

?>