const cheerio = require('cheerio');
const { v4 } = require('uuid');

const html = `<blockquote data-pid="mcWm_81f">如果有虫子想要吃含羞草的话，它就会闭合叶子，让对方不好吃它。</blockquote>
<hr />
<p data-pid="y2p50VYv">科学家把一只蚱蜢放到含羞草上<sup data-text="" data-url="https://www.nature.com/articles/s41467-022-34106-x"
    data-draft-node="inline" data-draft-type="reference" data-numero="1">[1]</sup>，蚱蜢想去咬一口叶子，结果含羞草迅速关闭。</p>
<figure data-size="normal"><img
    src="https://picx.zhimg.com/50/v2-89d3f0d71f5e86db7c741203fa4251fe_720w.jpg?source=1940ef5c" data-caption=""
    data-size="normal" data-rawwidth="327" data-rawheight="294" class="content_image" width="327" /></figure>
<p data-pid="1yx8y5Vz">蚱蜢并不甘心，顺着爬了上去，想第二次尝试，结果这只蚱蜢不仅没吃成，还把自己的腿让叶片夹住了，最后好不容易才把腿给晃出来，灰溜溜地跑掉了。</p><a class="video-box"
  href="https://link.zhihu.com/?target=https%3A//www.zhihu.com/video/1578005324493230080" target="_blank"
  data-video-id="" data-video-playable="true" data-name=""
  data-poster="https://pic1.zhimg.com/v2-086efc9722de42777c549709c9b7fb89.jpg?source=382ee89a"
  data-lens-id="1578005324493230080"><img class="thumbnail"
    src="https://pic1.zhimg.com/v2-086efc9722de42777c549709c9b7fb89.jpg?source=382ee89a" /><span class="content"><span
      class="title"><span class="z-ico-extern-gray"></span><span class="z-ico-extern-blue"></span></span><span
      class="url"><span class="z-ico-video"></span>https://www.zhihu.com/video/1578005324493230080</span></span></a>
<p data-pid="2JYczLUa">你看到含羞草叶柄有光电，而且还会移动，是因为科学家对含羞草做了处理，添加了<u><a
      href="https://link.zhihu.com/?target=https%3A//www.xabiolite.cn/products/egta-tetrasodium-salt-cas-13368-13-3"
      class=" wrap external" target="_blank" rel="nofollow noreferrer">钙离子指示剂</a>，用可以处理荧光信号的相机拍摄出来的。</u></p>
<figure data-size="normal"><img
    src="https://picx.zhimg.com/50/v2-6b8bb10e38b57acf3e00942bfda55d53_720w.jpg?source=1940ef5c" data-caption=""
    data-size="normal" data-rawwidth="685" data-rawheight="347"
    data-default-watermark-src="https://pica.zhimg.com/50/v2-c49d5f717403487732b583867fea6bc1_720w.jpg?source=1940ef5c"
    class="origin_image zh-lightbox-thumb" width="685"
    data-original="https://pic1.zhimg.com/v2-6b8bb10e38b57acf3e00942bfda55d53_r.jpg?source=1940ef5c" /></figure>
<p data-pid="Y-rGwpW8">在含羞草被蚱蜢攻击的瞬间，叶柄的细胞内的钙离子会发生快速变化，形成动作电位和变异电位，将被攻击的信号传递出去。</p>
<p data-pid="Utfkno0b">随着电信号的传出，叶柄的水分流出，让两侧的叶片细胞收缩，含羞草闭合上两边的小叶子。</p>
<figure data-size="normal"><img
    src="https://pic1.zhimg.com/50/v2-ae4b18c70062d7440fb5091199736721_720w.jpg?source=1940ef5c" data-caption=""
    data-size="normal" data-rawwidth="1756" data-rawheight="1038"
    data-default-watermark-src="https://picx.zhimg.com/50/v2-13488093b5d3474ba434661381b93e1b_720w.jpg?source=1940ef5c"
    class="origin_image zh-lightbox-thumb" width="1756"
    data-original="https://picx.zhimg.com/v2-ae4b18c70062d7440fb5091199736721_r.jpg?source=1940ef5c" /></figure>
<p data-pid="wN4PXW2f">不止是含羞草，其他植物也有类似的主动排斥捕食者的反应，虽然不会像含羞草那样合上叶片。</p>
<p data-pid="crAoki0p">下面这株植物的叶片在被毛毛虫咬上一口后，将信号传递给了出去（也是通过荧光标记的方法）。</p>
<a class="video-box" href="https://link.zhihu.com/?target=https%3A//www.zhihu.com/video/1578011299455381504"
  target="_blank" data-video-id="" data-video-playable="true" data-name=""
  data-poster="https://picd.zhimg.com/v2-c0be3c2084f9fb6aba3c0f489016ec96.jpg?source=382ee89a"
  data-lens-id="1578011299455381504">
  <img class="thumbnail" src="https://picd.zhimg.com/v2-c0be3c2084f9fb6aba3c0f489016ec96.jpg?source=382ee89a" />
  <span class="content">
    <span class="title">
      <span class="z-ico-extern-gray"></span>
      <span class="z-ico-extern-blue"></span>
    </span>
    <span class="url">
      <span class="z-ico-video"></span>
      https://www.zhihu.com/video/1578011299455381504
    </span>
  </span>
</a>
<p data-pid="7iZ3EQQ2">视频上方都标注有时间，你可以很清楚看到，这颗植物的信号传递速度没有含羞草的快。</p>
<p data-pid="hwoBXp85">有的植物防御速度比较快，有的就比较慢，从几分钟到几小时来激活局部或全身防御反应，例如通过产生植物激素乙烯和茉莉酸盐<sup
    data-text="茉莉酸及其衍生物茉莉酸甲酯等统称为茉莉酸盐，是广泛存在于植物中的一种生长调节物质，在植物细胞中起着非常重要的作用。茉莉酸作为信号分子广泛参与调节植物的生长发育和胁迫响应过程."
    data-url="https://www.chembk.com/cn/chem/%E8%8C%89%E8%8E%89%E9%85%B8" data-draft-node="inline"
    data-draft-type="reference" data-numero="2">[2]</sup>，引发非受损区域进行先发制人的防御。</p>
<p data-pid="5rAMOyCC">所以，含羞草叶子闭合是有作用的，那就是<b>对捕食者的主动防御。</b></p>
<figure data-size="normal"><img
    src="https://picx.zhimg.com/50/v2-5f4cb8cef2a6dec35becd5e504d1e3ce_720w.jpg?source=1940ef5c" data-caption=""
    data-size="normal" data-rawwidth="300" data-rawheight="225" class="content_image" width="300" /></figure>`


const $ = cheerio.load(html);

const acctachments = [];

const images = $('figure');
images.each((i, figure) => {
  const elem = $(figure).find('img');
  const title = $(figure).find('figcaption').text()
  const url = elem.attr('data-original') || elem.attr('src')
  const id = v4()
  acctachments.push({ id, title, url, type: 'image', seq: i + 1 });
  $(elem).replaceWith($(`<attachment data-id="${id}"/>`))
});
const videos = $('a.video-box');
videos.each((i, a) => {
  const url = $(a).find('span.url').text().trim();
  const title = $(a).find('span.title').text().trim();
  const id = v4();
  const poster = $(a).attr('data-poster');
  acctachments.push({
    id, title, url, type: 'video', seq: i,
  });
  if (poster) {
    acctachments.push({
      id: v4(),
      pid: id,
      title: '',
      url: poster,
      type: 'poster',
      seq: 1
    })
  }
  $(a).replaceWith(`<attachment data-id="${id}"/>`);
});
console.log(acctachments);
console.log($('body').html())