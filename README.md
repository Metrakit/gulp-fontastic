# Download your fonts from the awesome Fontastic webapp

This Gulp plugin will download your fonts from Fontastic webapp (https://app.fontastic.me) and copy in folder the fonts with a hash and the style in .css file or .scss file.

I have make this plugin because for my personnal developments I'm using the Fontastic CDN when I'm developing then I'm using the fonts in local for the production. So this plugin can get automatically the fonts thanks to your gulp workflow.

## Usage :

```
var fontastic      = require('gulp-fontastic');

gulp.task('fontastic', function() {
    fontastic({
        key: 'your-api-key',
        font_dir: 'public/fonts/',
        font_path: '/fonts/',
        style_path: 'scss/',
        file_name: '_fontastic',
        scss: true
    });
});
```

## TODO

- Create fonts and style folders if they doesnt exist
- Clean the fonts folder before to generate the new fonts
