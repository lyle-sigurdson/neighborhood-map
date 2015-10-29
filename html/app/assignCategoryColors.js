import chroma from 'chroma-js';

export default function (categories) {
    let scale = [
            '#4a3312',
            '#fb886d',
            '#3c5325',
            '#146e62',
            '#597c9e',
            '#c578a0'
        ];

    let colors = chroma.scale(scale).colors(categories.length);

    categories.forEach((category, i) => {
        category.color = colors[i];
    });
}
