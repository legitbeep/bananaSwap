import { extendTheme } from '@chakra-ui/react';

import { whiten, mode } from '@chakra-ui/theme-tools';
import colors from './colors';
import Button from './components/button';
import fonts from './fonts';

const customTheme = extendTheme({
    fonts,
    colors,
    components : {
        Button,
    },
    styles : {
        global : (props: any) => ({
            body:{
                bg : "rgb(44, 47, 54)",
            }
        })
    },
    initialColorMode: 'dark',
});

export default customTheme;