import React from 'react';
import tw from "tailwind-react-native-classnames";
import {View, Text, Image} from 'react-native';

function ProductCard(props:string)  {
    return (
        <View style={tw``}>
            <Image
              source={{
                uri: props//.service_logo
                ,
              }}
              style={tw``}
            />
          <Text style={tw``}>{props//.service_name
          }Produktnamn</Text>

            <Text style={tw``}>{props//.cost/price
            }Pris</Text>
          </View>
      );
        };


//         <div class="w-[358px] h-[84px] bg-white rounded-xl flex-col justify-start items-start inline-flex">
//     <div class="w-[358px] p-4 justify-center items-center gap-4 inline-flex">
//         <div class="w-11 h-11 bg-black rounded-full"></div>
//         <div class="grow shrink basis-0 flex-col justify-start items-start gap-1 inline-flex">
//             <div class="self-stretch justify-between items-center inline-flex">
//                 <div class="text-neutral-800 text-2xl font-medium font-['Inter']">Produktnamn</div>
//                 <div class="justify-start items-center gap-1 flex">
//                     <div class="justify-center items-start gap-4 flex">
//                         <div class="text-neutral-800 text-base font-normal font-['Inter']">Hantera</div>
//                     </div>
//                     <div class="w-[19px] h-[19px] relative origin-top-left rotate-90"></div>
//                 </div>
//             </div>
//             <div class="justify-center items-center gap-2 inline-flex">
//                 <div class="justify-start items-start gap-0.5 flex">
//                     <div class="text-neutral-800 text-base font-normal font-['Inter']">000 kr</div>
//                     <div class="text-neutral-800 text-base font-normal font-['Inter']">/ mån</div>
//                 </div>
//                 <div class="justify-center items-center gap-1 flex">
//                     <div class="w-4 h-4 justify-center items-center gap-[6.93px] flex">
//                         <div class="w-[10.83px] h-[13px] relative"></div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     </div>
// </div>
export default ProductCard;