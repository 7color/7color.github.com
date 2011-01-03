function! Test(path)
let ignore_files_list = '404.html,search.html,about.html,vim_tips.html,diary\/'
let ignore_files = split(ignore_files_list, ',')
let htmlfiles = split(glob(a:path . '**/*.html'), '\n')
"call filter(htmlfiles, 'v:val !~ "^'.a:path. 'diary\/"')
if !empty(ignore_files)
  for ignore_file in ignore_files
    call filter(htmlfiles, 'v:val !~ "^'. a:path . ignore_file .'"')
  endfor
endif
echo htmlfiles
endfunction
call Test('E:/github/7color.github.com/')
