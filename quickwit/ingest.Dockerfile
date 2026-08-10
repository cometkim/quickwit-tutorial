ARG QW_VERSION

FROM quickwit/quickwit:${QW_VERSION}

RUN apt-get -y update \
    && apt-get -y install curl \
    && rm -rf /var/lib/apt/lists/*
