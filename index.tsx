import { getRegion } from '@/pages/global/service';
import { Picker, View } from '@tarojs/components';
import { useAsyncEffect } from 'ahooks';
import { FC, useState } from 'react';
import { AtListItem } from 'taro-ui';

import styles from './index.module.less';

export type TRegionObj = {
  /** 选中内容的index数组用于picker value 赋值 */
  regionValue: number[];
  /** 展示的文本 省市区空格隔开 */
  regionText?: string;
  /** 选中内容的数组对象包括 index */
  regionValObjArr: any[];
};

export type TRegionPicker = {
  onReigonChange: (e: any, obj: TRegionObj) => void;
  /** 初始值 默认[0,0,0] */
  initialValues?: number[];
};

const RegionPicker: FC<TRegionPicker> = (props) => {
  const { onReigonChange, initialValues = [0, 0, 0] } = props;

  /** 高德省市区全部数据 */
  const [regionAll, setRegionAll] = useState<any[]>([]);
  /** 当前多选各列数据 */
  const [regionData, setRegionData] = useState<any[]>([]);
  /** 选中内容的index数组用于picker value 赋值 */
  const [regionValue, setRegionValue] = useState<any[]>(initialValues);
  const [regionText, setRegionText] = useState('');
  /** 选中内容的数组对象包括 index */
  const [regionValObjArr, setRegionValObjArr] = useState<any[]>([]);

  useAsyncEffect(async () => {
    // 获取高德省市区
    const res = await getRegion();
    if (res) {
      const regionAllTemp = res?.data?.districts?.[0]?.districts;
      setRegionAll(regionAllTemp);
      let range: any = [];
      let temp: any = [];
      for (let i = 0; i < regionAllTemp?.length; i++) {
        temp.push(regionAllTemp?.[i]?.name);
      }
      range.push(temp);
      temp = [];
      for (let i = 0; i < regionAllTemp?.[0]?.districts?.length; i++) {
        temp.push(regionAllTemp?.[regionValue?.[0]]?.districts?.[i]?.name);
      }
      range.push(temp);
      temp = [];
      for (
        let i = 0;
        i < regionAllTemp?.[0]?.districts?.[0]?.districts?.length;
        i++
      ) {
        temp.push(
          regionAllTemp?.[regionValue?.[0]]?.districts?.[regionValue?.[1]]
            ?.districts[i]?.name,
        );
      }
      range.push(temp);
      setRegionData(range);
      const tempObjArr = [
        { ...regionAllTemp?.[regionValue?.[0]], index: regionValue?.[0] },
        {
          ...regionAllTemp?.[regionValue?.[0]]?.districts?.[regionValue?.[1]],
          index: regionValue?.[1],
        },
        {
          ...regionAllTemp?.[regionValue?.[0]]?.districts?.[regionValue?.[1]]
            ?.districts?.[regionValue?.[2]],
          index: regionValue?.[2],
        },
      ];

      setRegionValObjArr(tempObjArr);
      setRegionText(
        `${tempObjArr?.[0]?.name || ''} ${tempObjArr?.[1]?.name || ''} ${
          tempObjArr?.[2]?.name || ''
        }`,
      );
    }
  }, []);

  const onColumnChange = (e) => {
    let rangeTemp = regionData;
    let valueTemp = regionValue;

    let column = e.detail.column;
    let row = e.detail.value;

    valueTemp[column] = row;

    switch (column) {
      case 0:
        let cityTemp: any = [];
        let districtAndCountyTemp: any = [];
        for (let i = 0; i < regionAll?.[row]?.districts?.length; i++) {
          cityTemp.push(regionAll?.[row]?.districts?.[i]?.name);
        }
        for (
          let i = 0;
          i < regionAll?.[row]?.districts?.[0]?.districts?.length;
          i++
        ) {
          districtAndCountyTemp.push(
            regionAll?.[row]?.districts?.[0]?.districts?.[i]?.name,
          );
        }
        valueTemp[1] = 0;
        valueTemp[2] = 0;
        rangeTemp[1] = cityTemp;
        rangeTemp[2] = districtAndCountyTemp;
        break;
      case 1:
        let districtAndCountyTemp2: any = [];
        for (
          let i = 0;
          i < regionAll?.[valueTemp?.[0]]?.districts?.[row]?.districts?.length;
          i++
        ) {
          districtAndCountyTemp2.push(
            regionAll?.[valueTemp?.[0]]?.districts?.[row]?.districts?.[i]?.name,
          );
        }
        valueTemp[2] = 0;
        rangeTemp[2] = districtAndCountyTemp2;
        break;
      case 2:
        break;
    }
    setRegionData(rangeTemp);

    const tempObjArr = [
      { ...regionAll?.[valueTemp?.[0]], index: valueTemp?.[0] },
      {
        ...regionAll?.[valueTemp?.[0]]?.districts?.[valueTemp?.[1]],
        index: valueTemp?.[1],
      },
      {
        ...regionAll?.[valueTemp?.[0]]?.districts?.[valueTemp?.[1]]
          ?.districts?.[valueTemp?.[2]],
        index: valueTemp?.[2],
      },
    ];

    setRegionValObjArr(tempObjArr);
    setRegionValue([...valueTemp]);
  };

  return (
    <View className={styles.container}>
      <Picker
        mode="multiSelector"
        range={regionData}
        value={regionValue}
        onChange={(e) => {
          setRegionText(
            `${regionValObjArr?.[0]?.name || ''} ${
              regionValObjArr?.[1]?.name || ''
            } ${regionValObjArr?.[2]?.name || ''}`,
          );
          onReigonChange(e, {
            regionValue,
            regionText,
            regionValObjArr,
          });
        }}
        onColumnChange={onColumnChange}
      >
        <AtListItem title="所在地" arrow="right" extraText={regionText} />
      </Picker>
    </View>
  );
};

export default RegionPicker;
