import cv2, numpy as np, os
SRC='images/kit/_src_explode.jpg'
# rects on the 1086x1448 exploded-view photo: (x1,y1,x2,y2)
ITEMS={
 'lid':      (285,  25, 895, 340),
 'base':     (305, 335, 815, 655),
 'hoodie':   (148, 648, 452, 972),
 'notebook': (452, 658, 698, 972),
 'tumbler':  (700, 640, 912,1056),
 'stickers': (150, 975, 415,1360),
 'card':     (430, 975, 720,1355),
 'pen':      (678,1038, 812,1338),
}
img=cv2.imread(SRC)
os.makedirs('images/kit',exist_ok=True)
for name,(x1,y1,x2,y2) in ITEMS.items():
    pad=18
    cx1,cy1=max(0,x1-pad),max(0,y1-pad)
    cx2,cy2=min(img.shape[1],x2+pad),min(img.shape[0],y2+pad)
    crop=img[cy1:cy2, cx1:cx2]
    mask=np.zeros(crop.shape[:2],np.uint8)
    rect=(pad//2,pad//2,crop.shape[1]-pad,crop.shape[0]-pad)
    bgd,fgd=np.zeros((1,65),np.float64),np.zeros((1,65),np.float64)
    cv2.grabCut(crop,mask,rect,bgd,fgd,6,cv2.GC_INIT_WITH_RECT)
    a=np.where((mask==2)|(mask==0),0,255).astype(np.uint8)
    a=cv2.morphologyEx(a,cv2.MORPH_CLOSE,np.ones((5,5),np.uint8))
    n,lab,stats,_=cv2.connectedComponentsWithStats(a,8)
    if n>1:
        a=np.where(lab==1+np.argmax(stats[1:,cv2.CC_STAT_AREA]),255,0).astype(np.uint8)
    inv=cv2.bitwise_not(a)
    nh,lh,sh,_=cv2.connectedComponentsWithStats(inv,4)
    for i in range(1,nh):
        touches = sh[i,cv2.CC_STAT_LEFT]==0 or sh[i,cv2.CC_STAT_TOP]==0 or                   sh[i,cv2.CC_STAT_LEFT]+sh[i,cv2.CC_STAT_WIDTH]>=inv.shape[1] or                   sh[i,cv2.CC_STAT_TOP]+sh[i,cv2.CC_STAT_HEIGHT]>=inv.shape[0]
        if not touches and sh[i,cv2.CC_STAT_AREA] < 0.07*a.size:
            a[lh==i]=255
    a=cv2.GaussianBlur(a,(5,5),0)
    ys,xs=np.where(a>10)
    if len(xs)==0: print('FAIL',name); continue
    out=np.dstack([crop,a])[ys.min():ys.max()+1, xs.min():xs.max()+1]
    cv2.imwrite('images/kit/%s.png'%name,out,[cv2.IMWRITE_PNG_COMPRESSION,9])
    print(name,out.shape[1],'x',out.shape[0])
