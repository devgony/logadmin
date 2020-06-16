VERSION=v14.4.0
DISTRO=linux-x64
mkdir -p /usr/local/lib/nodejs
tar -xJvf node-$VERSION-$DISTRO.tar.xz -C /usr/local/lib/nodejs

//.bash_profile
# Nodejs
echo "
VERSION=v14.4.0
DISTRO=linux-x64
export PATH=/usr/local/lib/nodejs/node-$VERSION-$DISTRO/bin:$PATH" >> ~/.bash_profile

