# 
# for (i in 1:1440){
#   teste$year[i] <- paste(teste$year[i], teste$month[i], sep="-")
# }
# Library
library(streamgraph)

data <- read.csv(file="/home/claudiasampedro/Documentos/7_periodo/TCC/TCC-1/data/csv_label_data.csv", head=TRUE, sep=",")

dat
# Create data:
# year=teste$year
# name=teste$name
# value=teste$qtd
# data=data.frame(year, name, value)

# Basic stream graph: just give the 3 arguments
data %>%
  streamgraph(key="name", value="qtd", date="year") %>%
  sg_axis_x(1, "year", "%Y") %>%
  sg_legend(show=TRUE, label="Labels: ")


