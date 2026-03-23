# ✅如何针对大Excel做文件读取？

# 典型回答

在POI中，提供了SXSSFWorkbook，通过将部分数据写入磁盘上的临时文件来减少内存占用。但是SXSSFWorkbook只能用于文件写入，但是文件读取还是不行的，就像我们前面分析过的，Excel的文件读取还是会存在内存溢出的问题的。
​

那如果要解决这个问题，可以考虑使用EasyExcel
​

> EasyExcel是一个基于Java的、快速、简洁、解决大文件内存溢出的Excel处理工具。他能让你在不用考虑性能、内存的等因素的情况下，快速完成Excel的读、写等功能。

关于使用XSSFWorkbook和EasyExcel的文件读取，我这里也做了个内存占用的对比：
​

### XSSFWorkbook文件读取

读取一个27.3 MB的文件（文件的生成代码在中）

同样使用Arthas查看内存占用情况：
​

​

占用内存在1000+M。
​

### EasyExcel文件读取

同样使用Arthas查看内存占用情况：

### ​

内存占用只有不到100M。
​

# 扩展知识

## EasyExcel为啥内存占用小
