@echo off 
python -c \"lines=open('README.md','r',encoding='utf-8').readlines();open('README.md','w',encoding='utf-8').writelines([l for l in lines if 'DATABASE_URL' not in l and 'fengjutian' not in l])\" 
